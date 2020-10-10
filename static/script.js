document.querySelector(".button").addEventListener("click", fetchData);
const tableNode = document.querySelector(".table");

// Fetch the table from the back end API
function fetchData() {
    const league_id = document.querySelector(".input__league").value;
    const matchday = document.querySelector(".input__matchday").value;

    console.log(`League id is ${league_id} and matchday is ${matchday}`);

    // Check if both are actually a number
    if (!Number.isInteger(league_id) || !Number.isInteger(matchday)) {
        // Fetch data from API
        fetch(window.location.href + "api/new/" + league_id + "/" + matchday)
            .then(response => response.json())
            .then(responseJson => {
                fillTable(responseJson)
            });
    } else {
        alert("Please make sure the matchday is a number")
    }
}

// Generate table using the retrieved json data
function fillTable(data) {
    console.log(data)

    // Fill static header numbers
    for (let i = 0; i < 20; i++) {
        let newHeaderNode = document.createElement("h1");
        newHeaderNode.classList.add("table__item");
        newHeaderNode.innerHTML = i + 1;
        newHeaderNode.style.gridRow = "1 / 2";
        newHeaderNode.style.gridColumn = `${i + 2} / ${i + 3}`;

        tableNode.appendChild(newHeaderNode);
    }

    // Fill table rows
    for (const team in data) {
        if (data.hasOwnProperty(team)) {
            fillTableRow(team, data[team][0], data[team][1], data[team][2])
        }
    }
}

// Fill one table row using the team name and the highest/current/lowest possible position
function fillTableRow(teamName, high, current, low) {
    // Fill node for the header text of the team
    let newTeamHeaderNode = document.createElement("span");
    newTeamHeaderNode.classList.add("table__item");
    newTeamHeaderNode.innerHTML = teamName;
    newTeamHeaderNode.style.gridColumn = "1 / 2";
    newTeamHeaderNode.style.gridRow = `${current + 1} / ${current + 2}`;
    tableNode.appendChild(newTeamHeaderNode);

    // Fill node of the current position
    let newCurrentPositionNode = document.createElement("span");
    newCurrentPositionNode.classList.add("table__item-current");
    newCurrentPositionNode.style.gridRow = `${current + 1} / ${current + 2}`;
    newCurrentPositionNode.style.gridColumn = `${current + 1} / ${current + 2}`;
    tableNode.appendChild(newCurrentPositionNode);
}