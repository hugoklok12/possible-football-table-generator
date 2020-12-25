from flask import Flask, render_template, request, url_for
from flask_api import FlaskAPI, status, exceptions
from possible_table import calculate_tables, get_current_matchday

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
@app.route('/api/new/league/<int:league_id>/matchday/<int:matchday>', methods=['GET'])
def create_table(league_id, matchday):
    if request.method != 'GET':
        return '', status.HTTP_405_METHOD_NOT_ALLOWED

    table = calculate_tables(league_id, matchday)

    return table, status.HTTP_200_OK

"""
Send back the current matchday of the selected league
"""
@app.route('/api/matchday/current/<int:league_id>', methods=['GET'])
def get_matchday(league_id):
    if request.method != 'GET':
        return '', status.HTTP_405_METHOD_NOT_ALLOWED

    current_matchday = get_current_matchday(league_id)
    response = {
        'matchday': current_matchday
    }
    return response, status.HTTP_200_OK

if __name__ == '__main__':
    app.run()