# possible-football-table-generator
Web app that displays all possible changes in the standings table after a played gameweek

![Preview](preview.png)

## Leagues
Supported leagues: English Premier League, Spanish La Liga, Italian Serie A, French League 1, Brazilian Série A.

## Installation
- Rename .env.example to .env and set the API_KEY value equal to a generated key from https://www.football-data.org

### Local
```
pip3 install -r requirements.txt
```

### Docker
```
docker build -t possible-table-project .
docker run -ti -p 5000:5000 possible-table-project bash
```

## Usage
``` 
python app.py 
```
- Navigate to the shown url in a browser
