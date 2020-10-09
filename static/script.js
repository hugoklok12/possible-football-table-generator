document.querySelector(".button").addEventListener("click", sendInput);

function sendInput() {
    let league_id = document.querySelector(".input__league").value;
    let matchday = document.querySelector(".input__matchday").value;

    console.log(`League id is ${league_id} and matchday is ${matchday}`);

    // Check if both are actually a number
    if (!Number.isInteger(league_id) || !Number.isInteger(matchday)) {
        fetch(window.location.href + "api/new/" + league_id + "/" + matchday)
            .then(response => response.json())
            .then(json => console.log(json));
    } else {
        alert("Please make sure the matchday is a number")
    }
}