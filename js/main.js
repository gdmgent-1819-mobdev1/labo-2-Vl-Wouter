function getProfiles() {
    fetch('https://randomuser.me/api/').then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            document.getElementById('profilearea').innerHTML = `
            <div class='profile'>
                <div class='profile__image'>
                    <img src='${data.results[0].picture.large}' alt='' class='profile__picture'>
                </div>
                <div class='profile__info'>
                    <p><span class='profile__name'>${data.results[0].name.first}</span><span class='profile__age'>${data.results[0].dob.age}</span></p>
                    <p class='profile__home'>${data.results[0].location.city}</p>
                </div>
            </div>
            `;
        });
    }, function(error) {
        console.log('ERROR: ' + error);
    });
}

getProfiles();