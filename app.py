from flask import Flask, render_template, request, url_for
from flask_api import FlaskAPI, status, exceptions
import json

app = Flask(__name__)

"""
Load index
"""
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


"""
Create table based on input data
"""
@app.route('/api/new/<int:league_id>/<int:matchday>', methods=['GET'])
def create_table(league_id, matchday):
    if request.method != 'GET':
        return '', status.HTTP_405_METHOD_NOT_ALLOWED

    x = {
        "league_id": league_id,
        "matchday": matchday,
    }

    return x, status.HTTP_200_OK

if __name__ == '__main__':
    app.run()