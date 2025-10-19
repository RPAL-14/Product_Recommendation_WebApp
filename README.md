# Product_Recommendation_WebApp
# Smart Product Recommendation System

## Overview
End-to-end web app using ML/NLP/CV/GenAI for product recommendation, analytics, and image-based classification.

## Features
- React frontend with modern UI
- FastAPI backend with recommendation, analytics, and classification endpoints
- Text-based semantic search, product grouping, and recommendations using vector database
- Image product classification
- GenAI-generated product descriptions 
- Clean analytics dashboard

## How to Run

### 1. Backend (FastAPI)
- `cd backend`
- `pip install -r requirements.txt`
- `uvicorn main:app --reload`

### 2. Frontend (React)
- `cd frontend`
- `npm install`
- `npm start`

### Notebooks
- Open all `.ipynb` files in `/notebooks` using Jupyter or Colab for code, analytics, model explainability, etc.

### API Endpoints
- `/recommend` : Product recommendations (by category or semantic search)
- `/first_product` : Retrieve first product info
- `/classify_image` : Upload and classify product image
- `/analytics` : Get dataset analytics

## Features
- Semantic search using vector models (Pinecone/SentenceTransformers)
- Rich analytics dashboard
- Product recommendations
- Image upload and automated classification
- End-to-end integration, modern UI


## Screenshots
<img width="1122" height="607" alt="Screenshot 2025-10-19 at 4 14 18 PM" src="https://github.com/user-attachments/assets/b6835482-a105-4ec5-96a5-34b62f31b665" />


## Authors
RUDRAAN PAL
19/10/25
Thapar institute of engineering and technology

---

**All components are integrated, and the full pipeline works end-to-end as shown in the assignment.**
