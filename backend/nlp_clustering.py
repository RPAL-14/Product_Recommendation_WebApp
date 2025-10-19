import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans

def load_products(csv_path):
    df = pd.read_csv(csv_path)
    for col in ['title', 'brand', 'description', 'categories']:
        df[col] = df[col].fillna("")
    df['combined_text'] = (
        df['title'] + " " +
        df['brand'] + " " +
        df['categories'].astype(str) + " " +
        df['description']
    )
    return df

def cluster_products(df, n_clusters=5):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(df['combined_text'].tolist(), show_progress_bar=True)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(embeddings)
    df['cluster'] = labels
    return df[['title', 'brand', 'categories', 'description', 'cluster']]

def semantic_search(df, query, top_n=5):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    all_embeddings = model.encode(df['combined_text'].tolist(), show_progress_bar=False)
    query_embedding = model.encode([query])[0]
    from sklearn.metrics.pairwise import cosine_similarity
    similarities = cosine_similarity([query_embedding], all_embeddings)[0]
    top_indices = similarities.argsort()[::-1][:top_n]
    return df.iloc[top_indices][['title', 'brand', 'categories', 'description']]
