class Profile {
    constructor(name, age, city, photo) {
        this.name = name;
        this.age = age;
        this.city = city;
        this.photo = photo;
    }
}

function getData() {
    let arrayPeople = [];
    fetch('https://randomuser.me/api/?results=10').then(function(response) {
        return response.json();
    }).then(function(data) {
        let people = data.results;
        for(let i = 0; i < people.length; i++) {
            let person = new Profile(people[i].name.first, people[i].dob.age, people[i].location.city, people[i].picture.large);
            arrayPeople.push(JSON.stringify(person));
        }
        console.log(arrayPeople);
        localStorage.setItem('people', arrayPeople);
    })
}

function getProfiles() {
    // fetch('https://randomuser.me/api/').then(function(response) {
    //     response.json().then(function(data) {
    //         console.log(data);

    //         document.getElementById('profilearea').innerHTML = `
    //         <div class='profile'>
    //             <div class='profile__image'>
    //                 <img src='${data.results[0].picture.large}' alt='' class='profile__picture'>
    //             </div>
    //             <div class='profile__info'>
    //                 <p><span class='profile__name'>${data.results[0].name.first}</span><span class='profile__age'>${data.results[0].dob.age}</span></p>
    //                 <p class='profile__home'>${data.results[0].location.city}</p>
    //             </div>
    //         </div>
    //         `;
    //     });
    // }, function(error) {
    //     console.log('ERROR: ' + error);
    // });
    getData();
    let localData = localStorage.getItem('people');
    console.log(localData);
    let splitstring = localData.split(',');
    let parseArray = [];
    forEach(splitstring => {
        
    })
}

getProfiles();