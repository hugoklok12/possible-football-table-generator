fetch('table_data.json', {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(response => response.json())
    .then(json => console.log(json))