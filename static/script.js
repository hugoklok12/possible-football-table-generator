fetch('http://127.0.0.1:5000/api/new/6371263/6721632', {
        mode: 'no-cors'
    }).then(response => response.json())
    .then(json => console.log(json));