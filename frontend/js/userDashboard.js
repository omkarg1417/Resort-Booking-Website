const backendUrl = "http://localhost:8000/"

const hotelData = `<div class="booking">
<div class="resort-info">
    <h3>Example Resort</h3>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi, expedita.</p>
    <button class="btn">Resort details</button>
</div>
<div class="resort-img-div">
        <img src="../images/homeImage.jpg" class="resort-img">
</div>
</div>`;

const username = document.querySelector('#username');
const email = document.querySelector('#email');
const bookings = document.querySelector('#bookings');
const logout = document.querySelector('#my-btn');
const homeProfile = document.querySelector('#home-profile');

logout.addEventListener('click', () => {
    window.location = "../html/login.html"
})

const logoutLink = `<a href="../html/login.html" class="head-nav" id = "home-dine home-profile"> Profile </a>`;

// password@123

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function getChildElement(hotel) {
    return `<div class="booking">
    <div class="resort-info">
        <h3>${hotel.name}</h3>
        <p>${hotel.description}</p>
        <button class="btn">Resort details</button>
    </div>
    <div class="resort-img-div">
            <img src="../images/homeImage.jpg" class="resort-img">
    </div>
    </div>`;
}

const displayUser = async () => {
    console.log("user aa gya");
    const userId = parseJwt(localStorage.getItem('token')).id;
    fetch(backendUrl + `user/get-user/${userId}`)
    .then(data => data.json())
    .then((user) => {
        user = user.data.user
        // console.log(user)
        // console.log(user.email)
        // console.log(user.name)
        username.innerHTML = user.name;
        email.innerHTML = user.email;
        // console.log(username, email);

        if(user.bookings.length === 0) {
            bookings.innerHTML = `<h2 class="text-center"> No bookings yet </h2>`;
        } else {
            bookings.innerHTML = '';
        }
        user.bookings.forEach( async (hotelId) => {
            console.log(hotelId);
            
            fetch(backendUrl + `user/get-hotel-info/${hotelId}`)
            .then(data => data.json())
            .then((res) => {
                res = res.data.hotel;

                // console.log(res);
                // bookings.appendChild(getChildElement(res));
                bookings.innerHTML += getChildElement(res);
                
            })
            
        })

    })
    .catch((err) => {console.log({
        err,
        message: "failure"
    })});

    
}


// document.addEventListener('load', displayUser);
displayUser();