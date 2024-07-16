import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class RecommendationSystem:
    def __init__(self):
        # Sample data: name, entry_fee, opening_hour, closing_hour, attraction_type, interests
        self.data = pd.DataFrame([
            ('Durbar Square', 15, 8, 18, 'historical', ['architecture', 'culture', 'history']),
            ('Nyatapola Temple', 0, 6, 18, 'religious', ['architecture', 'culture', 'spiritual']),
            ('Bhairavnath Temple', 0, 6, 18, 'religious', ['architecture', 'culture', 'spiritual']),
            ('Taumadhi Square', 0, 0, 24, 'landmark', ['culture', 'local life']),
            ('Pottery Square', 0, 8, 17, 'cultural', ['art', 'shopping', 'local life']),
            ('Peacock Window', 0, 0, 24, 'architectural', ['architecture', 'history']),
            ('National Art Gallery', 2, 10, 17, 'museum', ['art', 'culture', 'history']),
            ('Changu Narayan Temple', 10, 8, 18, 'religious', ['architecture', 'history', 'spiritual']),
            ('Kailashnath Mahadev Statue', 0, 6, 18, 'landmark', ['spiritual', 'scenic']),
            ('Suryavinayak Temple', 0, 6, 18, 'religious', ['spiritual', 'nature']),
        ], columns=['name', 'entry_fee', 'opening_hour', 'closing_hour', 'attraction_type', 'interests'])

    def calculate_similarity(self, user_interests, user_budget, user_time, attraction):
        # Interest similarity
        interest_similarity = len(set(user_interests) & set(attraction['interests'])) / len(set(user_interests) | set(attraction['interests']))
        
        # Budget similarity (1 if within budget, 0 otherwise)
        budget_similarity = 1 if attraction['entry_fee'] <= user_budget else 0
        
        # Time similarity (1 if open during user's preferred time, 0 otherwise)
        time_similarity = 1 if attraction['opening_hour'] <= user_time <= attraction['closing_hour'] else 0
        
        # Combine similarities (you can adjust weights as needed)
        return (interest_similarity * 0.5) + (budget_similarity * 0.3) + (time_similarity * 0.2)

    def get_recommendations(self, user_interests, user_budget, user_time, top_n=5):
        similarities = []
        for _, attraction in self.data.iterrows():
            similarity = self.calculate_similarity(user_interests, user_budget, user_time, attraction)
            similarities.append((attraction['name'], similarity))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_n]

    def get_attraction_details(self, name):
        return self.data[self.data['name'] == name].to_dict('records')[0]

# Example usage
# rs = RecommendationSystem()
# recommendations = rs.get_recommendations(['history', 'art'], 20, 14)
# print(recommendations)