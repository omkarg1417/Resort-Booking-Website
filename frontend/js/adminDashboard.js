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

const adminname = document.querySelector('#adminname');
const email = document.querySelector('#email');
const logout = document.querySelector('#my-btn');

logout.addEventListener('click', () => {
    window.location = "../html/adminLogin.html"
})
// password@123

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const displayAdmin = async () => {
    console.log("admin aa gya");
    const adminId = parseJwt(localStorage.getItem('token')).id;
    fetch(backendUrl + `admin/get-admin/${adminId}`, {
        method: 'GET',
        headers: {
            auth : localStorage.getItem('token')
        }
    })
    .then(data => data.json())
    .then(async (admin) => {
        admin = admin.data.admin
        
        adminname.innerHTML = admin.name;
        email.innerHTML = admin.email;
        console.log(adminname, email);
        
        fetch(backendUrl + 'admin/get-user-count', {
            method: 'GET',
            headers: {
                auth: localStorage.getItem('token')
            }
        })
        .then(data => data.json())
        .then((res) => {
            res = res.data.count;
            document.getElementById('user-count-number').innerHTML = res;
        })
            
    })
    .catch((err) => {console.log({
        err,
        message: "failure"
    })});


    
}


// document.addEventListener('load', displayadmin);
displayAdmin();