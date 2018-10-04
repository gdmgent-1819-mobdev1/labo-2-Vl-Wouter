class Profile {
    constructor(name, age, city, photo) {
        this.name = name;
        this.age = age;
        this.city = city;
        this.photo = photo;
        this.liked = 0;
    }
}

let profile;
let profilekey = 0;
let clickcount = 0;

function toLocalStorage(name, values) {
    localStorage.setItem(name, values);
}

function getLocalStorage(key) {
    return localStorage.getItem(key);
}

function getData() {
    fetch('https://randomuser.me/api/?results=10').then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data.results);
        console.log(profilekey);
        for(let i = 0; i < data.results.length; i++) {
            // stringArray.push(JSON.stringify(data.results[i]));
            let person = new Profile(data.results[i].name.first, data.results[i].dob.age, data.results[i].location.city, data.results[i].picture.large);
            toLocalStorage(i + profilekey, JSON.stringify(person));
            
        }
        // toLocalStorage('people', stringArray);
    });
}

function getProfile(key) {
    let profdata = JSON.parse(getLocalStorage(key));
    document.getElementById('profilearea').innerHTML = `
    <div class='profile'>
        <div class='profile__image'>
            <img src='${profdata.photo}' alt='${profdata.name}' class='picture__fill'>
        </div>
        <div class='profile__info'>
            <p><span class='profile__name'>${profdata.name}</span><span class='profile__age'>${profdata.age}</span></p>
            <p class='profile__home'>${profdata.city}</p>
        </div>
    </div>
    `;
    console.log(profdata);
    return profdata;
}

function refreshData() {
    document.getElementById('profilearea').innerHTML = '';
    clickcount = 0;
    getData();
    console.log(profilekey);
    profile = getProfile(profilekey);
}

function like() {
    console.log('Liked:' + profile.name);
    profile.liked = 1;
    toLocalStorage(profilekey, JSON.stringify(profile));

    if(clickcount > 9) {
        refreshData();
    }
    else {
        profilekey++;
        profile = getProfile(profilekey);
    }
}

function dislike() {

}


// Onload
window.onload = refreshData();

// event listeners
let likebutton = document.getElementById('yes');
let dislikebutton = document.getElementById('nope');
likebutton.addEventListener('click', function() {like()});
dislikebutton.addEventListener('click', dislike());



