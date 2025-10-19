import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy

# Simulated user-item ratings (replace with real user data if available)
def generate_sample_ratings():
    data = {
        'user_id': [1, 1, 1, 2, 2, 3, 3, 3, 4, 5],
        'product_id': [0, 1, 2, 2, 3, 0, 1, 3, 2, 1],
        'rating': [5, 3, 4, 2, 4, 4, 5, 3, 2, 4]  # rating scale 1-5
    }
    return pd.DataFrame(data)

# Train collaborative filtering model on user-item ratings
def train_collab_model():
    df_ratings = generate_sample_ratings()
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df_ratings[['user_id', 'product_id', 'rating']], reader)
    trainset, testset = train_test_split(data, test_size=0.2, random_state=42)
    
    model = SVD()
    model.fit(trainset)
    
    preds = model.test(testset)
    accuracy.rmse(preds)
    return model

# Given a user id, recommend top N products
def get_user_recommendations(model, user_id, n=5):
    all_product_ids = set(range(100))  # Adjust total product count
    rated_products = set(model.trainset.ur[model.trainset.to_inner_uid(user_id)])
    unrated_products = all_product_ids - rated_products
    
    predictions = []
    for pid in unrated_products:
        inner_uid = model.trainset.to_inner_uid(user_id)
        inner_iid = pid
        pred = model.predict(inner_uid, inner_iid)
        predictions.append((pid, pred.est))
    
    predictions.sort(key=lambda x: x[1], reverse=True)
    return predictions[:n]
