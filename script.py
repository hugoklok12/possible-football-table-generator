#!/usr/bin/python
import argparse
import http.client
import json
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv('API_KEY')

def send_request(endpoint):
    connection = http.client.HTTPConnection('api.football-data.org')
    headers = { 'X-Auth-Token': API_KEY }
    connection.request('GET', '/v2/' + endpoint, None, headers)
    response = json.loads(connection.getresponse().read().decode())
    return response

def get_entered_matchday():
    parser = argparse.ArgumentParser()
    parser.add_argument('matchday', help='Enter the matchday', type=int)
    args = parser.parse_args()
    return str(args.matchday)

def get_current_table():
    response = send_request('competitions/2021/standings?standingType=HOME')
    current_table = response['standings'][0]['table']
    return current_table

def get_matchday_matches(matchday):
    response = send_request('competitions/2021/matches?matchday=' + matchday)
    matchday_matches = response['matches']
    return matchday_matches

def Main():
    matchday = get_entered_matchday()
    current_table = get_current_table()
    matchday_matches = get_matchday_matches(matchday)

if __name__ == '__main__':
    Main()
