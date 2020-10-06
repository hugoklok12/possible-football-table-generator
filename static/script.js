fetch(window.location.href + '/api/new/1/2')
    .then(response => response.json())
    .then(json => console.log(json));