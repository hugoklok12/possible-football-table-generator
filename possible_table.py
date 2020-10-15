#!/usr/bin/python
import argparse
import http.client
import json
import os
import itertools  
import collections
import webbrowser
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

def get_complete_table(league_id):
    response = send_request(f'competitions/{league_id}/standings?standingType=HOME')
    complete_table = response['standings'][0]['table']
    return complete_table

def get_matchups(matchday, league_id):
    response = send_request(f'competitions/{league_id}/matches?matchday={matchday}')
    matchday_matches = response['matches']
    matchups = []
    for match in matchday_matches:
        matchup = [match['homeTeam']['name'], match['awayTeam']['name']]
        matchups.append(matchup)
    return matchups

def calculate_tables(league_id, matchday):
    matchups = get_matchups(matchday, league_id)
    complete_table = get_complete_table(league_id)

    # create dict with only the name and current point count
    current_standings = {}
    for team in complete_table:
        current_standings[team['team']['name']] = team['points']
    
    # sort dict and fill high/low placeholders + current position
    team_high_lows = {}
    sorted_standings = sorted(current_standings.items(), key=lambda x: x[1], reverse=True)
    i = 0
    for key, team in sorted_standings:
        team_high_lows[key] = [100, (i + 1), -100] # [high, current, low]
        i += 1

    # generate all combinations of wins / draws / losses in 10 games (= one matchday) and fill with corresponding integers
    all_possible_results = itertools.product(range(3), repeat=10)
    all_possible_tables = []

    print('Calculating all possible tables...')
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
            i += 1
        all_possible_tables.append(possible_table)
    print('All possible tables created.')

    print('Sorting all tables and defining high/low per team...')
    i = 0
    for possible_table in all_possible_tables:
        possible_table = sorted(possible_table.items(), key=lambda x: x[1], reverse=True)
        j = 1
        for key, table_position in possible_table:
            # check for new high
            if j < team_high_lows[key][0]:
                team_high_lows[key][0] = j
            # check for new low
            elif j > team_high_lows[key][2]:
                team_high_lows[key][2] = j
            j += 1
        i += 1
    print('Done defining high/low.')

    print('Returning results.')
    return team_high_lows

if __name__ == '__main__':
    Main()
