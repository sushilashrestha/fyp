from flask import Flask, jsonify, request, send_from_directory
from recommendation_system import RecommendationSystem
import os

app = Flask(__name__, static_folder='.')

# Use os.path.join to create the file path
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(current_dir, 'copy.csv')

rs = RecommendationSystem(csv_file_path)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    types = request.args.get('types', '').split(',')
    budget = float(request.args.get('budget', 100))
    time = int(request.args.get('time', 12))
    recommendations = rs.get_recommendations(types, budget, time)
    return jsonify(recommendations)



@app.route('/api/attraction', methods=['GET'])
def get_attraction():
    name = request.args.get('name')
    attraction = rs.get_attraction_details(name)
    return jsonify(attraction)

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)