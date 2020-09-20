#!/usr/bin/python
import argparse
import http.client
import json
import os
import itertools  
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
API_KEY = os.getenv('API_KEY')

def send_request(endpoint):
    connection = http.client.HTTPConnection('api.football-data.org')
    headers = { 'X-Auth-Token': API_KEY }
    connection.request('GET', '/v2/' + endpoint, None, headers)
    response = json.loads(connection.getresponse().read().decode())
    return response

def start_program(arguments):
    parser = argparse.ArgumentParser()
    parser.add_argument('league_id', type=int)
    parser.add_argument('matchday', type=int)
    args = parser.parse_args()

    if args.league_id is 1:
        league_id = 2021
    elif args.league_id is 2:
        league_id = 2013
    else:
        league_id = 2021

    arguments.append(args.matchday)
    arguments.append(league_id)
    return arguments

def get_complete_table(league_id):
    response = send_request('competitions/' + str(league_id) + '/standings?standingType=HOME')
    complete_table = response['standings'][0]['table']
    return complete_table

def get_matchups(matchday, league_id):
    response = send_request('competitions/' + str(league_id) + '/matches?matchday=' + str(matchday))
    matchday_matches = response['matches']
    matchups = []
    for match in matchday_matches:
        matchup = [match['homeTeam']['name'], match['awayTeam']['name']]
        matchups.append(matchup)
    return matchups

def Main():
    arguments = []
    arguments = start_program(arguments)
    matchday = arguments[0]
    league_id = arguments[1]

    matchups = get_matchups(matchday, league_id)
    complete_table = get_complete_table(league_id)
    current_standings = {}

    # create dict with only the name and current point count
    for team in complete_table:
        current_standings[team['team']['name']] = team['points']

    # generate all combinations of wins / draws / losses in 10 games and fill with corresponding integers
    all_possible_results = itertools.product(range(3), repeat=10)
    all_possible_tables = []

    # loop through every matchup and calculate points using brute force (n = 3^10 = 59049)
    for results in all_possible_results:
        possible_table = {}
        i = 0
        for result in results:
            # home team wins
            if result is 0:
                possible_table[matchups[i][0]] = current_standings[matchups[i][0]] + 3
                possible_table[matchups[i][1]] = current_standings[matchups[i][1]]
            # away team wins
            elif result is 1:
                possible_table[matchups[i][1]] = current_standings[matchups[i][1]] + 3
                possible_table[matchups[i][0]] = current_standings[matchups[i][0]]
            # no team wins (draw)
            elif result is 2:
                possible_table[matchups[i][0]] = current_standings[matchups[i][0]] + 1
                possible_table[matchups[i][1]] = current_standings[matchups[i][1]] + 1
            else:
                print('Something went wrong while processing possible tables')
            i = i + 1

        all_possible_tables.append(possible_table)

    # fill excel sheet with all possible tables to enhance debugging
    pd.DataFrame(all_possible_tables).to_excel('~/Downloads/all_possible_tables.xlsx', header=False, index=False)
    print('Excel sheet succesfully created')

if __name__ == '__main__':
    Main()
