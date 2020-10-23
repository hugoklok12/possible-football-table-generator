document.querySelector('.button').addEventListener('click', fetchData);
const tableNode = document.querySelector('.table');
const statsGridNode = document.querySelector('.table__stats-grid');
const dataGridNode = document.querySelector('.table__data-grid');
const settingsNode = document.querySelector('.settings');

// Fetch the table from the back end API
function fetchData() {
    const league_id = document.querySelector('.input__league').value;
    console.log(`League id is ${league_id}`);

    settingsNode.style.visibility = 'hidden';

    // Fetch data
    fetch(window.location.href + 'api/new/' + league_id)
        .then(response => response.json())
        .then(responseJson => {
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
        const headerNumberGridArea = `1 / ${i + 1} / 2 / ${i + 2}`;
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
            let separatorGridArea = `1 / ${i} / -1 / ${i + 1}`;
            fillCellHandler('separator', 'data', separatorGridArea);
        }
    }
}

// Fill one table row using the team's data
function fillDataRow(team, name) {
    // Fill text node for the team name
    const teamNameGridArea = `${team.currentPosition + 1} / 1 / ${team.currentPosition + 2} / 2`;
    let teamNameNode = fillCellHandler('team-name', 'stats', teamNameGridArea);
    teamNameNode.innerHTML = name;

    // Fill text node of the team's form
    const formGridArea = `${team.currentPosition + 1} / 2 / ${team.currentPosition + 2} / 3`;
    let formNode = fillCellHandler('form', 'stats', formGridArea);
    formNode.innerHTML = team.currentForm;

    // Fill text node for the team's points
    const pointsGridArea = `${team.currentPosition + 1} / 3 / ${team.currentPosition + 2} / 3`;
    let pointsNode = fillCellHandler('points', 'stats', pointsGridArea);
    pointsNode.innerHTML = team.currentPoints;

    // Fill text node for the team's goal difference
    const goalDiffGridArea = `${team.currentPosition + 1} / 4 / ${team.currentPosition + 2} / 4`;
    let goalDiffNode = fillCellHandler('goaldiff', 'stats', goalDiffGridArea);
    goalDiffNode.innerHTML = team.goalDifference;

    // Fill text node for the team's amount of playes games
    const playedGamesGridArea = `${team.currentPosition + 1} / 5 / ${team.currentPosition + 2} / 5`;
    let playedGamesNode = fillCellHandler('playedgames', 'stats', playedGamesGridArea);
    playedGamesNode.innerHTML = team.playedGames;

    // Fill text node for the team's next opponent
    oopponentGridArea = `${team.currentPosition + 1} / 6 / ${team.currentPosition + 2} / 6`;
    let opponentNode = fillCellHandler('opponent', 'stats', oopponentGridArea);
    opponentNode.innerHTML = team.nextOpponent.substring(0, 3).toUpperCase();

    // Fill dot node of the team's current position
    const currentPositionGridArea = `${team.currentPosition + 1} / ${team.currentPosition} / 
                                     ${team.currentPosition + 1} / ${team.currentPosition}`;
    fillCellHandler('current', 'data', currentPositionGridArea);
    return;

    const highPositionGridArea = `${current + 1} / ${high + 1} / 
                                ${current + 2} / ${high + 2}`;
    fillCellHandler('connector-right', highPositionGridArea);
    // Only place 'high' dot if it's higher than the current position
    if (high !== current) {
        fillCellHandler('endtip', highPositionGridArea);
    }

    const lowPositionGridArea = `${current + 1} / ${low + 1} / 
                               ${current + 2} / ${low + 2}`;
    fillCellHandler('connector-left', lowPositionGridArea);
    // Only place 'low' dot if it's higher than the current position
    if (low !== current) {
        fillCellHandler('endtip', lowPositionGridArea);
    }


    /* Check if there's a gap more than 0 between the low and high to decide 
       if a complete connector node is needed */
    if ((low - high) > 0) {
        // Fill light blue barnode to connect the low and highest position 
        let connectorGridArea = `${current + 1} / ${high + 2} / 
                                 ${current + 2} / ${low + 1}`;
        fillCellHandler('connector-middle', connectorGridArea);
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

fetchData();