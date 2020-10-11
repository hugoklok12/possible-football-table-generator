document.querySelector('.button').addEventListener('click', fetchData);
const tableNode = document.querySelector('.table');

// Fetch the table from the back end API
function fetchData() {
    const league_id = document.querySelector('.input__league').value;
    const matchday = document.querySelector('.input__matchday').value;

    console.log(`League id is ${league_id} and matchday is ${matchday}`);

    // Check if both are actually a number
    if (!Number.isInteger(league_id) || !Number.isInteger(matchday)) {
        // Fetch data from API
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

    // Fill static header numbers
    for (let i = 0; i < 20; i++) {
        let headerGridArea = `1 / ${i + 2} / 2 / ${i + 3}`;
        let headerNumberNode = fillTableCell('header', headerGridArea);
        headerNumberNode.innerHTML = i + 1;
        headerNumberNode.style.fontWeight = 'bold';
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
    // Fill node for the team name
    let headerGridArea = `${current + 1} / 1 / ${current + 2} / 2`;
    let headerNode = fillTableCell('header', headerGridArea);
    headerNode.innerHTML = teamName;

    // Fill node of the current position
    let currentPositionGridArea = `${current + 1} / ${current + 1} / 
                                   ${current + 2} / ${current + 2}`
    fillTableCell('current', currentPositionGridArea);

    // Prevent doubled dots by comparing for same position values
    if (high !== current) {
        // Fill node of the highest position
        let highPositionGridArea = `${current + 1} / ${high + 1} / 
                                    ${current + 2} / ${high + 2}`;
        fillTableCell('endtip', highPositionGridArea);
        fillTableCell('connector-right', highPositionGridArea);
    }

    // Prevent doubled dots by comparing for same position values
    if (low !== current) {
        // Fill node of the lowest position
        let lowPositionGridArea = `${current + 1} / ${low + 1} / 
                                   ${current + 2} / ${low + 2}`;
        fillTableCell('endtip', lowPositionGridArea);
        fillTableCell('connector-left', lowPositionGridArea);
    }

    /* Check there if is a difference between the low and high to decide 
       if a connector is needed */
    if (low !== high) {
        // Fill node with a light blue bar to connect the low and highest position 
        let connectorGridArea = `${current + 1} / ${high + 2} / 
                                 ${current + 2} / ${low + 1}`;
        fillTableCell('connector-middle', connectorGridArea);
    }

}

// Fill one table cell
function fillTableCell(nodeType, gridArea) {
    let newCellNode = document.createElement('div');

    // Add classes to the node based on given node type
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
        default:
            console.log('The supplied node type is not valid');
            return;
    }

    newCellNode.style.gridArea = gridArea;
    tableNode.appendChild(newCellNode);

    return newCellNode;
}