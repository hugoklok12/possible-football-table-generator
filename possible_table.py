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
    response = send_request(f'competitions/{league_id}/standings')
    complete_table = response['standings'][0]['table']
    matchday = response['season']['currentMatchday']
    return complete_table, matchday

def get_matchups(matchday, league_id):
    response = send_request(f'competitions/{league_id}/matches?matchday={matchday}')
    all_matchup_data = response['matches']

    # filter out all the matchup data except the home and away team
    filtered_matchups = []
    for match in all_matchup_data:
        filtered_matchup = {
            'homeTeam': match['homeTeam']['name'],
            'awayTeam': match['awayTeam']['name']
        }
        filtered_matchups.append(filtered_matchup)
    return filtered_matchups

def get_opponent(matchups, team_name):
    for matchup in matchups:
        if matchup['homeTeam'] == team_name:
            return matchup['awayTeam']
        elif matchup['awayTeam'] == team_name:
            return matchup['homeTeam']

def calculate_tables(league_id):
    complete_table, matchday = get_complete_table(league_id)
    matchups = get_matchups(matchday, league_id)

    # filter out redundant team stats and add new stats
    all_filtered_team_data = {}
    for team_data in complete_table:
        filtered_team_data = {
            'currentPoints': team_data['points'],
            'nextOpponent': get_opponent(matchups, team_data['team']['name']),
            'goalDifference': team_data['goalDifference'],
            'trailingGames': ((matchday - 1) - team_data['playedGames']),
            'currentPosition': team_data['position'],
            'highestPossiblePos': team_data['position'],
            'lowestPossiblePos': team_data['position'],
            'currentForm': team_data['form']
        }
        all_filtered_team_data[team_data['team']['name']] = filtered_team_data
    
    # generate all combinations of wins / draws / losses in 10 games (= one matchday) 
    # and fill with corresponding integers
    print('Calculating all possible tables...')
    all_possible_results = itertools.product(range(3), repeat=10) # (n = 3^10 = 59049)

    all_possible_tables = []
    for possible_results in all_possible_results:
        possible_table = []
        i = 0
        for possible_result in possible_results:
            home_team_result = [all_filtered_team_data[matchups[i]['homeTeam']]['goalDifference'], matchups[i]['homeTeam']]
            away_team_result = [all_filtered_team_data[matchups[i]['homeTeam']]['goalDifference'], matchups[i]['awayTeam']]
            # home team won
            if possible_result == 0:
                home_team_result.insert(0, (all_filtered_team_data[matchups[i]['homeTeam']]['currentPoints'] + 3))
                away_team_result.insert(0, (all_filtered_team_data[matchups[i]['awayTeam']]['currentPoints']))
            # away team won
            elif possible_result == 1:
                away_team_result.insert(0, (all_filtered_team_data[matchups[i]['awayTeam']]['currentPoints'] + 3))
                home_team_result.insert(0, (all_filtered_team_data[matchups[i]['homeTeam']]['currentPoints']))
            # no team won (draw)
            elif possible_result == 2:
                home_team_result.insert(0, (all_filtered_team_data[matchups[i]['homeTeam']]['currentPoints'] + 1))
                away_team_result.insert(0, (all_filtered_team_data[matchups[i]['awayTeam']]['currentPoints'] + 1))
            possible_table.append(home_team_result)
            possible_table.append(away_team_result)
            i += 1
        all_possible_tables.append(possible_table)
    print('All possible tables created.')

    print('Sorting all tables and defining high/low per team...')
    # i = 0
    for possible_table in all_possible_tables:
        # sort by points -> if points are the same then sort the same ones by goal difference
        possible_table = sorted(possible_table, key=lambda sl: (-sl[0],-sl[1]))

        i = 1
        for team in possible_table:
            if i < all_filtered_team_data[team[2]]['highestPossiblePos']:
                all_filtered_team_data[team[2]]['highestPossiblePos'] = i
            if i > all_filtered_team_data[team[2]]['lowestPossiblePos']:
                all_filtered_team_data[team[2]]['lowestPossiblePos'] = i
            i += 1

    print('Returning results.')
    table_data = { 'matchday': matchday, 
                   'data': all_filtered_team_data }
    return table_data
