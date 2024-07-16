from flask import Flask, jsonify, request, send_from_directory
from recommendation_system import RecommendationSystem
import os

app = Flask(__name__, static_folder='.')
rs = RecommendationSystem()

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    interests = request.args.get('interests', '').split(',')
    budget = float(request.args.get('budget', 20))
    time = int(request.args.get('time', 12))
    recommendations = rs.get_recommendations(interests, budget, time)
    return jsonify(recommendations)

@app.route('/api/attraction', methods=['GET'])
def get_attraction():
    name = request.args.get('name')
    attraction = rs.get_attraction_details(name)
    return jsonify(attraction)

if __name__ == '__main__':
    app.run(debug=True)