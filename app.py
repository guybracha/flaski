from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Sample hidden objects
hidden_objects = [
    {"id": 1, "x": 100, "y": 150, "found": False},
    {"id": 2, "x": 300, "y": 200, "found": False},
    {"id": 3, "x": 500, "y": 100, "found": False},
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-objects')
def get_objects():
    return jsonify(hidden_objects)

if __name__ == "__main__":
    app.run(debug=True)
