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
let getData = new Promise(
    function(resolve, reject) {
        fetch('https://randomuser.me/api/?results=10')
        .then(function(response) {
            data = response.json();
            resolve(data);
        }, error => reject(error));
    }
);

// Create objects and drop into localstorage
let createProfiles = new Promise(
    function(resolve, reject) {
        getData.then(response => {
            response.results.forEach((res, i) => {
                let person = new Profile(res.name.first, res.dob.age, res.location.city, res.picture.large);
                setLocal((i + profilecount), JSON.stringify(person));
            });
            resolve(null);
            
        }, error => reject(error))
    }
);

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


// Check if profilecount exists in localstorage
// if it doesn't, initialize it
if(existsLocal('profilecount')) {
    profilecount = parseInt(getLocal('profilecount'));
    showProfile(profilecount);
} else {
    profilecount = 0;
    createProfiles.then(() => showProfile(profilecount));
}

// Check if clickcount exists in localstorage
// if it doesn't, initialize it
existsLocal('clickcount') ? clickcount = parseInt(getLocal('clickcount')) : clickcount = 0;

// function when the like button is clicked
function like() {
    // Get the current profile
    let profile = JSON.parse(getLocal(profilecount));
    // Change the liked value to 1
    profile.liked = 1;
    // Put the changed profile back into the localStorage
    setLocal(profilecount, JSON.stringify(profile));
    // increment the profilecounter
    profilecount++;
    // drop profilecounter in localstorage
    setLocal('profilecount', profilecount);
    // increment the clickcounter
    // check if click count is bigger than 9
    if(clickcount > 8) {
        // reset click count to 0 and get new profiles
        clickcount = 0;
        // drop clicks into localstorage
        setLocal('clickcount', clickcount);
        createProfiles.then(() => console.log('finish him!'))
    } else {
        clickcount++;
        // drop clicks into localstorage
        setLocal('clickcount', clickcount);
        // if new profiles don't need to be fetched
        // get the next profile on the list
        showProfile(profilecount);
    }
    
}

// Add Event listeners to the like and dislike buttons
document.getElementById('like').addEventListener('click', function() {like()});
document.getElementById('dislike').addEventListener('click', function() {dislike()});