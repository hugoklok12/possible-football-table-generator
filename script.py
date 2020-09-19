#!/usr/bin/python
import argparse
import http.client
import json
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv('API_KEY')

def sendRequest(requestArguments):
    connection = http.client.HTTPConnection('api.football-data.org')
    headers = { 'X-Auth-Token': API_KEY }
    connection.request('GET', '/v2/' + requestArguments, None, headers)
    response = json.loads(connection.getresponse().read().decode())
    print (response)


def Main():

    # get standings
    sendRequest("competitions/2021/standings?standingType=HOME")

if __name__ == "__main__":
    Main()
