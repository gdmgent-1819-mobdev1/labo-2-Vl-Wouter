// Class for profile objects
class Profile {
    constructor(name, age, city, photo) {
        this.name = name;
        this.age = age;
        this.city = city;
        this.photo = photo;
        this.liked = 0;
    }
}

// Function to check if value exists
function existsLocal(name) {
    let result;
    localStorage.getItem(name) === null ? result = false : result = true;
    return result;
}

// Function to put things in localStorage
function setLocal(name, value) {
    localStorage.setItem(name, value);
}

// Function to get things from localStorage
function getLocal(name) {
    return localStorage.getItem(name);
}

// Counter for clicks and profile
let profilecount;
let clickcount;

// function for getting new profiles
function getData() {
    return new Promise(
        function(resolve, reject) {
            fetch('https://randomuser.me/api/?results=10')
            .then(function(response) {
                data = response.json();
                resolve(data);
            }, error => reject(error));
        }
    )
}

// Create objects and drop into localstorage
function createProfiles() {
    // Returns the promise, creating the promise once doesn't work for re-use
    return new Promise(
        function(resolve, reject) {
            getData().then(response => {
                response.results.forEach((res, i) => {
                    let person = new Profile(res.name.first, res.dob.age, res.location.city, res.picture.large);
                    setLocal((i + profilecount), JSON.stringify(person));
                });
                resolve(null);
                
            }, error => reject(error));
        }
    )
}

// Show profile on screen
function showProfile(key) {
    let profile = JSON.parse(getLocal(key));
    document.getElementById('profilearea').innerHTML = `
    <div class='profile'>
        <div class='profile__image'>
            <img src='${profile.photo}' alt='${profile.name}' class='picture__fill'>
        </div>
        <div class='profile__info'>
            <p><span class='profile__name'>${profile.name}</span><span class='profile__age'>${profile.age}</span></p>
            <p class='profile__home'>${profile.city}</p>
        </div>
    </div>
    `;
}

// function to check click count, adds profiles when click count is at profile limit?
function checkClick() {
    if(clickcount > 8) {
        clickcount = 0;
        setLocal('clickcount', clickcount);
        createProfiles().then(() => {
            showProfile(profilecount);
            refreshList();
        });
    } else {
        clickcount++;
        setLocal('clickcount', clickcount);
        showProfile(profilecount);
        refreshList();
    }
}
// rewrite like and dislike to rate()
function rate(rating) {
    let current = JSON.parse(getLocal(profilecount));
    rating === 'like' ? current.liked = 1 : current.liked = -1;
    setLocal(profilecount, JSON.stringify(current));
    profilecount++;
    setLocal('profilecount',profilecount);
    checkClick();
}


// Check if profilecount exists in localstorage
// if it doesn't, initialize it
if(existsLocal('profilecount')) {
    profilecount = parseInt(getLocal('profilecount'));
    showProfile(profilecount);
    refreshList();
} else {
    profilecount = 0;
    createProfiles().then(() => {
        showProfile(profilecount);
        refreshList();
    });
}

// Check if clickcount exists in localstorage
// if it doesn't, initialize it
existsLocal('clickcount') ? clickcount = parseInt(getLocal('clickcount')) : clickcount = 0;

// Function to toggle hidden elements
function toggleHide(element) {
    document.getElementById(element).classList.toggle('hidden');
}

//function to populate lists
function refreshList() {
    document.getElementById('likeList').innerHTML = '';
    document.getElementById('dislikeList').innerHTML = '';
    for(let i = 0; i < profilecount; i++) {
        let profile = JSON.parse(getLocal(i));
        if(profile.liked === 1) {
            document.getElementById('likeList').innerHTML += `
            <div class='list__item'>
                <img src='${profile.photo}' alt='${profile.name}' class='list__img'>
                <p class='list__name'>${profile.name}</p>
                <button type='button' class='btn btn__round--small btn--red' id='change_${i}'><i class="fas fa-times"></i></button> 
            </div>
            `;
        }
        else {
            document.getElementById('dislikeList').innerHTML += `
            <div class='list__item'>
                <img src='${profile.photo}' alt='${profile.name}' class='list__img'>
                <p class='list__name'>${profile.name}</p>
                <button type='button' class='btn btn__round--small btn--green' id='change_${i}'><i class="fas fa-heart"></i></button> 
            </div>
            `;
        }
    }
    let buttons = document.getElementsByClassName('btn__round--small');
    for(let i = 0; i < buttons.length; i++) {
        let id = buttons[i].id.split('_')[1];
        console.log(id);
        buttons[i].addEventListener('click', () => changeMyMind(id));
    }
}

// function to change your mind
function changeMyMind(id) {
    let changing = JSON.parse(getLocal(id));
    changing.liked == 1 ? changing.liked = -1 : changing.liked = 1;
    setLocal(id, JSON.stringify(changing));
    refreshList();
}


// Add Event listeners to the like and dislike buttons
document.getElementById('like').addEventListener('click', function() {rate('like')});
document.getElementById('dislike').addEventListener('click', function() {rate('dislike')});
document.getElementById('showList').addEventListener('click', function() {toggleHide('list')});
document.getElementById('hideList').addEventListener('click', () => toggleHide('list'));