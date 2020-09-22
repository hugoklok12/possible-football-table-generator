# possible-football-table-generator
Script that displays all possible changes in the standings table after a played gameweek (currently English Premier League and Brazilian Série A only)

## Installation:
```
pip install python-dotenv pandas openpyxl
```
- Rename .env.example to .env and set the API_KEY value equal to a generated key from https://www.football-data.org

## Usage
```
python possible-table.py [league_id] [matchday]
```
- The two supported league id's are the English Premier League (1) and the Brazilian Série A (2)