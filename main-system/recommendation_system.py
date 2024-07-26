import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer

class RecommendationSystem:
    def __init__(self, csv_file_path):
        # Read data from CSV file
        self.data = pd.read_csv(csv_file_path)
        
        # Function to convert time to hours, handling 24:00:00 case
        def time_to_hours(time_str):
            if time_str == '24:00:00':
                return 0  # or 24, depending on how you want to handle midnight
            return pd.to_datetime(time_str, format='%H:%M').hour

        # Convert opening and closing hours to 24-hour format
        self.data['opening_hour'] = self.data['opening hour'].apply(time_to_hours)
        self.data['closing_hour'] = self.data['closing hour'].apply(time_to_hours)
        
        # Convert entry fee to numeric, replacing any non-numeric values with 0
        self.data['entry_fee'] = pd.to_numeric(self.data['Entry fee'], errors='coerce').fillna(0)
        
        # Create feature vectors
        self.mlb = MultiLabelBinarizer()
        self.type_features = self.mlb.fit_transform(self.data['Type'].str.split(','))
        self.budget_features = self.data['entry_fee'].values.reshape(-1, 1)
        self.time_features = np.column_stack((self.data['opening_hour'], self.data['closing_hour']))

    def calculate_similarity(self, user_type, user_budget, user_time):
        user_type_vector = self.mlb.transform([user_type])
        user_budget_vector = np.array([[user_budget]])
        user_time_vector = np.array([[user_time, user_time]])

        type_sim = cosine_similarity(user_type_vector, self.type_features)
        budget_sim = cosine_similarity(user_budget_vector, self.budget_features)
        time_sim = cosine_similarity(user_time_vector, self.time_features)

        # Combine similarities (you can adjust weights as needed)
        combined_sim = (type_sim * 0.4) + (budget_sim * 0.3) + (time_sim * 0.3)
        return combined_sim.flatten()

    def get_recommendations(self, user_type, user_budget, user_time, top_n=5):
        similarities = self.calculate_similarity(user_type, user_budget, user_time)
        top_indices = similarities.argsort()[-top_n:][::-1]
        
        recommendations = []
        for idx in top_indices:
            recommendations.append((self.data.iloc[idx]['Attraction name'], similarities[idx]))
        
        return recommendations

    def get_attraction_details(self, name):
        attraction = self.data[self.data['Attraction name'] == name].iloc[0]
        return {
            'name': attraction['Attraction name'],
            'type': attraction['Type'],
            'opening_hour': attraction['opening hour'],
            'closing_hour': attraction['closing hour'],
            'entry_fee': attraction['Entry fee'],
            'location': attraction['Location'],
            'description': attraction['description']
        }

# Example usage
# rs = RecommendationSystem('copy.csv')
# recommendations = rs.get_recommendations(['Temple', 'Historical Site'], 100, 14)
# print(recommendations)