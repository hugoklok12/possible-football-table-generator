// Define constants
const tableNode = document.querySelector('.table');
const statsGridNode = document.querySelector('.table__stats-grid');
const dataGridNode = document.querySelector('.table__data-grid');
const settingsNode = document.querySelector('.settings');
const buttonNode = document.querySelector('.button');
const leagueNode = document.querySelector('.input__league');
const matchdayNode = document.querySelector('.input__matchday');

// Define event listeners
buttonNode.addEventListener('click', fetchData);
leagueNode.addEventListener('change', (event) => {
    getCurrentMatchday(event.target.value);
})

// Get current matchday to preselect that matchday in matchday dropdown
function getCurrentMatchday(league_id) {
    fetch(window.location.href + 'api/matchday/current/' + league_id)
        .then(response => response.json())
        .then(responseJson => {
            matchdayNode.val = responseJson.matchday;
        });
}

// Fetch the table from the back end API
function fetchData() {

    showSpinner(true)
    fetch(`${window.location.href} /api/new / league / ${leagueNode.value} /matchday/${matchdayNode.value} `)
        .then(response => response.json())
        .then(responseJson => {
            showSpinner(false)
            fillTable(responseJson);
        });
}

// Generate table using the retrieved json data
function fillTable(response) {
    console.log(response)

    // Clear current table if the table was already filled
    if (statsGridNode.hasChildNodes() && dataGridNode) {
        while (statsGridNode.firstChild) {
            statsGridNode.firstChild.remove();
        }
        while (dataGridNode.firstChild) {
            dataGridNode.firstChild.remove();
        }
    }

    prepareTable(response.matchday);

    // Fill table rows with data of every team
    for (const teamName of Object.keys(response.data)) {
        fillDataRow(response.data[teamName], teamName);
    }
}

function prepareTable(matchday) {
    // Fill header nodes
    let matchdayNode = document.createElement('p');
    matchdayNode.innerHTML = 'Matchday ' + matchday;
    matchdayNode.classList.add('table__header', 'table__header-matchday');
    statsGridNode.appendChild(matchdayNode);

    let pointsNode = document.createElement('p');
    pointsNode.innerHTML = 'PTS';
    pointsNode.classList.add('table__header', 'table__header-points');
    statsGridNode.appendChild(pointsNode);

    let goalDiffNode = document.createElement('p');
    goalDiffNode.innerHTML = 'GD';
    goalDiffNode.classList.add('table__header', 'table__header-goaldiff');
    statsGridNode.appendChild(goalDiffNode);

    let formNode = document.createElement('p');
    formNode.innerHTML = 'FORM';
    formNode.classList.add('table__header', 'table__header-form');
    statsGridNode.appendChild(formNode);

    let playedGamesNode = document.createElement('p');
    playedGamesNode.innerHTML = 'GP';
    playedGamesNode.classList.add('table__header', 'table__header-games');
    statsGridNode.appendChild(playedGamesNode);

    let opponentNode = document.createElement('p');
    opponentNode.innerHTML = 'Opponent';
    opponentNode.classList.add('table__header', 'table__header-opponent');
    statsGridNode.appendChild(opponentNode);

    // Loop through columns in grid
    for (let i = 0; i < 20; i++) {
        // Fill static header numbers on top of the table
        const headerNumberGridArea = `1 / ${i + 1} / 2 / ${i + 2} `;
        const headerNumberNode = fillCellHandler('header-number', 'data', headerNumberGridArea);
        headerNumberNode.innerHTML = i + 1;

        // Put bottom border on every row to improve visibility
        const borderRowGridArea = `${i + 1} / 1 / ${i + 2} / -1`;
        fillCellHandler('row-border', 'stats', borderRowGridArea);
        fillCellHandler('row-border', 'data', borderRowGridArea);

        // Add background color and border every other column / row to improve visibility
        if (i % 2 !== 0) {
            const backgroundGridArea = `1 / ${i} / -1 / ${i + 1}`;
            fillCellHandler('background-column', 'stats', backgroundGridArea);
            fillCellHandler('background-column', 'data', backgroundGridArea);
        }

        // Add border separators between position 4/5 and 17/18
        if (i === 4 || i === 17) {
            const separatorGridArea = `1 / ${i} / -1 / ${i + 1}`;
            fillCellHandler('separator', 'data', separatorGridArea);
        }
    }
}

// Fill one table row using the team's data
function fillDataRow(team, name) {
    /* FILL STATISTICAL CELLS */
    const teamNameGridArea = `${team.currentPosition + 1} / 1 / ${team.currentPosition + 2} / 2`;
    const formGridArea = `${team.currentPosition + 1} / 2 / ${team.currentPosition + 2} / 3`;
    const pointsGridArea = `${team.currentPosition + 1} / 3 / ${team.currentPosition + 2} / 3`;
    const goalDiffGridArea = `${team.currentPosition + 1} / 4 / ${team.currentPosition + 2} / 4`;
    const playedGamesGridArea = `${team.currentPosition + 1} / 5 / ${team.currentPosition + 2} / 5`;
    const opponentGridArea = `${team.currentPosition + 1} / 6 / ${team.currentPosition + 2} / 6`;

    let teamNameNode = fillCellHandler('team-name', 'stats', teamNameGridArea);
    teamNameNode.innerHTML = name;

    let formNode = fillCellHandler('form', 'stats', formGridArea);
    formNode.innerHTML = team.currentForm;

    let pointsNode = fillCellHandler('points', 'stats', pointsGridArea);
    pointsNode.innerHTML = team.currentPoints;

    let goalDiffNode = fillCellHandler('goaldiff', 'stats', goalDiffGridArea);
    goalDiffNode.innerHTML = team.goalDifference;

    let playedGamesNode = fillCellHandler('playedgames', 'stats', playedGamesGridArea);
    playedGamesNode.innerHTML = team.playedGames;

    let opponentNode = fillCellHandler('opponent', 'stats', opponentGridArea);
    opponentNode.innerHTML = team.nextOpponent.substring(0, 3).toUpperCase();

    /* FILL DATA CELLS */
    const currentPositionGridArea = `${team.currentPosition + 1} / ${team.currentPosition} / 
                                     ${team.currentPosition + 1} / ${team.currentPosition}`;
    const highPositionGridArea = `${team.currentPosition + 1} / ${team.highestPossiblePos} / 
                                  ${team.currentPosition + 2} / ${team.highestPossiblePos + 1}`;
    const lowPositionGridArea = `${team.currentPosition + 1} / ${team.lowestPossiblePos} / 
                                 ${team.currentPosition + 2} / ${team.lowestPossiblePos + 1}`;

    fillCellHandler('current', 'data', currentPositionGridArea);

    if (team.highestPossiblePos !== team.currentPosition) {
        fillCellHandler('endtip', 'data', highPositionGridArea);
        fillCellHandler('connector-right', 'data', highPositionGridArea);
        if (team.lowestPossiblePos === team.currentPosition) {
            fillCellHandler('connector-left', 'data', currentPositionGridArea);
        }
    }
    if (team.lowestPossiblePos !== team.currentPosition) {
        fillCellHandler('endtip', 'data', lowPositionGridArea);
        fillCellHandler('connector-left', 'data', lowPositionGridArea);
        if (team.highestPossiblePos === team.currentPosition) {
            fillCellHandler('connector-right', 'data', currentPositionGridArea);
        }
    }

    /* Check if there's enough of a gap between the low and high to decide 
    if a middle connector node is needed */
    if ((team.lowestPossiblePos - team.highestPossiblePos) >= 2) {
        const connectorGridArea = `${team.currentPosition + 1} / ${team.highestPossiblePos + 1} / 
                                 ${team.currentPosition + 2} / ${team.lowestPossiblePos}`;
        fillCellHandler('connector-middle', 'data', connectorGridArea);
    }
}

// Fill one table cell
function fillCellHandler(nodeType, grid, gridArea) {
    let newCellNode = document.createElement('div');

    switch (nodeType) {
        case 'team-name':
            newCellNode.classList.add('table__team-name');
            break;
        case 'form':
        case 'points':
        case 'goaldiff':
        case 'playedgames':
        case 'opponent':
            newCellNode.classList.add('table__stats');
            break;
        case 'header-number':
            newCellNode.classList.add('table__header', 'table__header-number');
            break;
        case 'current':
            newCellNode.classList.add('table__item', 'table__item-current');
            break;
        case 'endtip':
            newCellNode.classList.add('table__item', 'table__item-endtip');
            break;
        case 'connector-middle':
            newCellNode.classList.add('table__connector', 'table__connector-middle');
            break;
        case 'connector-left':
            newCellNode.classList.add('table__connector', 'table__connector-left');
            break;
        case 'connector-right':
            newCellNode.classList.add('table__connector', 'table__connector-right');
            break;
        case 'separator':
            newCellNode.classList.add('table__separator');
            break;
        case 'background-column':
            newCellNode.classList.add('table__background');
            break;
        case 'row-border':
            newCellNode.classList.add('table__border');
            break;
        default:
            console.log('The supplied node type is not valid');
            return;
    }

    newCellNode.style.gridArea = gridArea;
    if (grid === 'stats') {
        statsGridNode.appendChild(newCellNode);
    } else if (grid === 'data') {
        dataGridNode.appendChild(newCellNode);
    } else {
        console.log('The grid type is invalid.');
    }

    return newCellNode;
}

function showSpinner(state) {
    const spinner = document.getElementById('spinner');
    if (state) {
        spinner.style.display = 'block';
    } else if (!state) {
        spinner.style.display = 'none';
    } else {
        console.log('Invalid spinner state was given');
    }
}

// Preselect matchday when loading page using the default id (Premier League)
getCurrentMatchday(2021)