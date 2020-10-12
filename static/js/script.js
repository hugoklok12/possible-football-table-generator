document.querySelector('.button').addEventListener('click', fetchData);
const tableNode = document.querySelector('.table');

// Fetch the table from the back end API
function fetchData() {
    const league_id = document.querySelector('.input__league').value;
    const matchday = document.querySelector('.input__matchday').value;
    console.log(`League id is ${league_id} and matchday is ${matchday}`);

    // Check if both are actually a number before fetching the data
    if (!Number.isInteger(league_id) || !Number.isInteger(matchday)) {
        // Fetch data from back-end Flask API
        fetch(window.location.href + 'api/new/' + league_id + '/' + matchday)
            .then(response => response.json())
            .then(responseJson => {
                fillTable(responseJson)
            });
    } else {
        alert('Please make sure the matchday is a number')
    }
}

// Generate table using the retrieved json data
function fillTable(data) {
    console.log(data)

    // Clear current table if the table was already filled
    if (tableNode.hasChildNodes()) {
        while (tableNode.firstChild) {
            tableNode.firstChild.remove();
        }
    }

    // Loop through columns in grid
    for (let i = 0; i < 20; i++) {
        // Fill static header numbers on top of the table
        let headerGridArea = `1 / ${i + 2} / 2 / ${i + 3}`;
        let headerNumberNode = fillTableCell('header', headerGridArea);
        headerNumberNode.innerHTML = i + 1;
        headerNumberNode.style.fontWeight = 'bold';

        // Add background color every other column to improve visibility
        if (i % 2 !== 0) {
            let backgroundGridArea = `1 / ${i + 1} / -1 / ${i + 2}`;
            fillTableCell('background', backgroundGridArea);
        }

        // Add border separators between position 4/5 and 17/18
        if (i === 4 || i === 17) {
            let separatorGridArea = `1 / ${i + 1} / -1 / ${i + 2}`;
            separatorGridArea = fillTableCell('separator', separatorGridArea);
        }
    }

    // Fill table rows with data of every team
    for (const team in data) {
        if (data.hasOwnProperty(team)) {
            fillTableRow(team, data[team][0], data[team][1], data[team][2]);
        }
    }
}

// Fill one table row using the team name and the highest/current/lowest possible position
function fillTableRow(teamName, high, current, low) {
    // Fill text node for the team name
    let headerGridArea = `${current + 1} / 1 / ${current + 2} / 2`;
    let headerNode = fillTableCell('header', headerGridArea);
    headerNode.innerHTML = teamName;

    // Fill dot node of the team's current position
    let currentPositionGridArea = `${current + 1} / ${current + 1} / 
                                   ${current + 2} / ${current + 2}`
    fillTableCell('current', currentPositionGridArea);

    let highPositionGridArea = `${current + 1} / ${high + 1} / 
                                ${current + 2} / ${high + 2}`;
    fillTableCell('connector-right', highPositionGridArea);
    // Only place 'high' dot if it's higher than the current position
    if (high !== current) {
        fillTableCell('endtip', highPositionGridArea);
    }

    let lowPositionGridArea = `${current + 1} / ${low + 1} / 
                               ${current + 2} / ${low + 2}`;
    fillTableCell('connector-left', lowPositionGridArea);
    // Only place 'low' dot if it's higher than the current position
    if (low !== current) {
        fillTableCell('endtip', lowPositionGridArea);
    }


    /* Check if there's a gap more than 0 between the low and high to decide 
       if a complete connector node is needed */
    if ((low - high) > 0) {
        // Fill light blue barnode to connect the low and highest position 
        let connectorGridArea = `${current + 1} / ${high + 2} / 
                                 ${current + 2} / ${low + 1}`;
        fillTableCell('connector-middle', connectorGridArea);
    }
}

// Fill one table cell
function fillTableCell(nodeType, gridArea) {
    let newCellNode = document.createElement('div');

    switch (nodeType) {
        case 'header':
            newCellNode.classList.add('table__header');
            break;
        case 'current':
            newCellNode.classList.add('table__item');
            newCellNode.classList.add('table__item-current');
            break;
        case 'endtip':
            newCellNode.classList.add('table__item');
            newCellNode.classList.add('table__item-endtip');
            break;
        case 'connector-middle':
            newCellNode.classList.add('table__connector');
            newCellNode.classList.add('table__connector-middle');
            break;
        case 'connector-left':
            newCellNode.classList.add('table__connector');
            newCellNode.classList.add('table__connector-left');
            break;
        case 'connector-right':
            newCellNode.classList.add('table__connector');
            newCellNode.classList.add('table__connector-right');
            break;
        case 'separator':
            newCellNode.classList.add('table__separator');
            break;
        case 'background':
            newCellNode.classList.add('table__background');
            break;
        default:
            console.log('The supplied node type is not valid');
            return;
    }

    newCellNode.style.gridArea = gridArea;
    tableNode.appendChild(newCellNode);

    return newCellNode;
}