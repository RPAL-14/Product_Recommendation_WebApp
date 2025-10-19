import pandas as pd
from fastapi import FastAPI, Query, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
from pinecone import Pinecone, ServerlessSpec
from collab_filtering import train_collab_model, get_user_recommendations
from nlp_clustering import load_products, cluster_products, semantic_search
from image_classifier import classify_image, load_model
import re

CSV_PATH = "/Users/rudraanpal/Desktop/IKARUS3D_ASSIGNMENT/backend/app/intern_data_ikarus.csv"

# ML Models
collab_model = train_collab_model()
image_model = load_model()  # torchvision ResNet model for images
text_model = SentenceTransformer('all-MiniLM-L6-v2')  # sentence transformer for NLP
genai_pipeline = pipeline("text-generation", model="distilgpt2")

# Load dataset and preprocess
DATA_PATH = os.path.join(os.path.dirname(__file__), "intern_data_ikarus.csv")
df = pd.read_csv(DATA_PATH)
for col in ['title', 'brand', 'description', 'categories']:
    df[col] = df[col].fillna("")
df['combined_text'] = df['title'] + " " + df['brand'] + " " + df['categories'].astype(str) + " " + df['description']

# Compute embeddings
embeddings = text_model.encode(df['combined_text'].tolist(), show_progress_bar=True)


pc = Pinecone(api_key="pcsk_3am1je_JiRvhVibtCSUDBNaiCRcLBqAqr6jao8S4N5vRwRpEcuP29C6PrF6STQykU9a4fJ")  # replace with your key

index_name = "product-embeddings"

# Check if index exists, create if not
if not pc.list_indexes().names().__contains__(index_name):
    pc.create_index(
        name=index_name,
        dimension=embeddings.shape[1],  # embedding vector size
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")  # adjust region as needed
    )

# Connect to index
index = pc.Index(index_name)

# Upsert embeddings into Pinecone
vectors = [(str(i), embeddings[i]) for i in range(len(embeddings))]
index.upsert(vectors)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API is working"}

@app.get("/first_product")
def get_first_product():
    csv_path = os.path.join(os.path.dirname(__file__), "intern_data_ikarus.csv")
    df = pd.read_csv(csv_path)
    return df.iloc[0].to_dict()

@app.get("/products")
def get_products():
    csv_path = os.path.join(os.path.dirname(__file__), "intern_data_ikarus.csv")
    df = pd.read_csv(csv_path)
    return df.head(10).to_dict(orient="records")

@app.get("/recommend")
def recommend_products(category: str = Query(None)):
    csv_path = os.path.join(os.path.dirname(__file__), "intern_data_ikarus.csv")
    df = pd.read_csv(csv_path)
    if category:
        df['categories'] = df['categories'].astype(str)
        mask = df['categories'].str.contains(category, case=False, na=False)
        df = df[mask]
    df = df.where(pd.notnull(df), None)
    return df.head(5).to_dict(orient="records")

@app.get("/analytics")
def get_analytics():
    csv_path = os.path.join(os.path.dirname(__file__), "intern_data_ikarus.csv")
    df = pd.read_csv(csv_path)
    df['price'] = df['price'].astype(str).str.replace(r'[^\d.]', '', regex=True)
    df['price'] = pd.to_numeric(df['price'], errors='coerce')
    return {
        "average_price": df['price'].mean(skipna=True),
        "total_products": len(df),
        "category_counts": df['categories'].value_counts().to_dict()
    }

@app.get("/recommend/{product_id}")
def recommend(product_id: int, top_n: int = 5):
    if product_id < 0 or product_id >= len(df):
        raise HTTPException(status_code=404, detail="Product ID not found")
    sim_scores = list(enumerate(cosine_similarity(embeddings)[product_id]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_indices = [i[0] for i in sim_scores[1:top_n+1]]
    recommended_products = df.iloc[top_indices][['title', 'brand', 'categories', 'price', 'description']]
    recommended_products = recommended_products.where(pd.notnull(recommended_products), None)
    return recommended_products.to_dict(orient='records')

@app.get("/collab_recommend/{user_id}")
def collab_recommend(user_id: int, top_n: int = 5):
    try:
        recommendations = get_user_recommendations(collab_model, user_id, top_n)
        return [{"product_id": pid, "estimated_rating": score} for pid, score in recommendations]
    except Exception as e:
        return {"error": f"Could not generate recommendations: {str(e)}"}

@app.get("/clustered_products")
def get_clustered_products(n_clusters: int = 5):
    df = load_products(CSV_PATH)
    clustered_df = cluster_products(df, n_clusters)
    return clustered_df.to_dict(orient='records')

@app.get("/semantic_search")
def search_products(q: str, top_n: int = 5):
    user_vec = text_model.encode([q])[0].tolist()
    result = index.query(vector=user_vec, top_k=top_n)
    top_ids = [int(match['id']) for match in result['matches']]
    results = df.iloc[top_ids].copy()  # Make copy for safe assignment
    # Replace non-JSON safe float values
    results = results.replace([float('inf'), float('-inf')], None)
    results = results.where(pd.notnull(results), None)
    return results.to_dict(orient='records')

@app.post("/classify_image")
async def classify_image_upload(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        from tempfile import NamedTemporaryFile
        with NamedTemporaryFile(delete=True, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp.flush()
            pred = classify_image(tmp.name, image_model)
        return {"predicted_class_id": pred}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error processing image")
    
@app.get("/generate_description")
def generate_description(
    product_title: str = Query(...), brand: str = Query(""), category: str = Query(""), max_length: int = 120
):
    prompt = (
        f"Product: {product_title}. "
        f"Brand: {brand}. "
        f"Category: {category}. "
        "Description (2-3 sentences, no repetition):"
    )
    result = genai_pipeline(prompt, max_length=max_length, num_return_sequences=1)
    text = result[0]['generated_text']
    description = text.replace(prompt, "").strip()
    end = description.find("\n\n")
    if end != -1:
        description = description[:end]
    return {"generated_description": description}
