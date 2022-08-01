// ---------------------------------------------------------------------------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyDHibfOzWhRccSDqh3aXzUmJb3oKjSkYAo",
    authDomain: "hotel-website-59dd8.firebaseapp.com",
    databaseURL: "https://hotel-website-59dd8-default-rtdb.firebaseio.com",
    projectId: "hotel-website-59dd8",
    storageBucket: "hotel-website-59dd8.appspot.com",
    messagingSenderId: "504451516472",
    appId: "1:504451516472:web:4fc77373191636c7047ecd"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// ---------------------------------------------------------------------------------------------------------

var database = firebase.database();

var user = database.ref("user");

var hotelName;
var hotelCost, hotelUrl, hotelMaxOccupancy;

document.onload = retriveData();

var hotelInfoList = [];
var promoCodeList = ['SPECIAL', 'GETAWAY', 'CLIMB', 'SPIRITUAL', 'ADVENTURE', 'EXPLORE'];


function retriveData(){
  let hotelDB = firebase.database().ref('hotel');
  hotelDB.on("value", getData);
}

function getData(data){
  let values = data.val();
  let keys = Object.keys(values);

  let elem = document.querySelector(".choose-stay");
  elem.innerHTML = '';

  
  for(let i = 0; i < keys.length; ++i){
    let idx = keys[i];
    // keyList.push(idx);
    // console.log(idx);
    hotelName = values[idx].name;
    hotelMaxOccupancy = values[idx].maxOccupancy;
    hotelCost = values[idx].cost;
    hotelUrl = values[idx].link;

    hotelInfoList.push({
      name: hotelName,
      occupancy: hotelMaxOccupancy,
      cost: hotelCost,
    });

    // console.log(hotelName, hotelMaxOccupancy, hotelCost);

    // pushing data in the form of following HTML    
    elem.innerHTML += `
    <div class="choices">
      <div class="stay-info">
        <h2 class="hotel-name">Hotel: ${hotelName}</h2>
        <p>Max occupancy: ${hotelMaxOccupancy}</p>
        <p class="price-tag">IDR <strong> ${hotelCost} </strong> for one night</p>
        <button id = "btn${i}" >Select</button>
      </div>
      <img src="${hotelUrl}" alt="">
    </div>
    `;
  }
  settingListeners();
}



//adding event listeners to each buttons

function settingListeners() {
  var btn = document.querySelectorAll("button");
  btn.forEach(
    (e) => {
      e.addEventListener("click", ()=>{
        unHideForm(e);
      });
    }
    )
  }


  //
  function unHideForm(btn){
    let elem = document.querySelector(".choose-stay");
    elem.setAttribute("style","display:none;"); 
    var headform = document.querySelector("#book-heading");
    var formelm = document.querySelector(".booking-form");
    headform.setAttribute("style", "visibility:visible; height:auto;");
    formelm.setAttribute("style", "visibility:visible; height:auto;");
    
    let str = btn.getAttribute("id");
    let num = parseInt(str[str.length-1], 10);

    //getting respective hotel info with respective idx number

    hotelName = hotelInfoList[num].name;
    hotelCost = hotelInfoList[num].cost;
    hotelMaxOccupancy = hotelInfoList[num].occupancy;

    console.log(hotelName, hotelMaxOccupancy, hotelCost);
  }
  
//------------------------------------------------------------------------------------------------------------
//LAYOUT 2

  
//referring user
var elem = document.querySelector(".booking-form");
elem.addEventListener("submit", getUserData);

function getUserData(e){
    e.preventDefault();
    
    let username = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let checkInDate = document.getElementById("check-in-date").value;
    let checkOutDate = document.getElementById("check-out-date").value;
    let promoCode = document.getElementById("promo-code").value;

  if(!checkInDate || !checkOutDate) {
    alert("Enter valid date");
    return;
  }

    console.log(promoCode);
    
    let date1 = new Date(checkInDate);
    let date2 = new Date(checkOutDate);
    let currDate = new Date();
    // a check for valid date
    if(date1 > date2 || date1 < currDate){
        alert("Enter valid date");
        return;
    }

    if(promoCode != ""){
      let found = 0;
      for(let i = 0; i < promoCodeList.length; ++i){
        if(promoCode===promoCodeList[i]){
          found = 1;
          break;
        }
      }
      if(found){
        hotelCost -= hotelCost/10;
      }
      else{
        alert("Enter valid promo code");
        return;
      }
    }

    alert("Hotel booked successfully");
    
    // a check for correct promo code

    // checkInDate = `${date1.getDay()}/${date1.getMonth()}/${date1.getFullYear()}`;
    // checkOutDate = `${date2.getDay()}/${date2.getMonth()}/${date2.getFullYear()}`;
    // checkOutDate = date2.getDay() + '/' + date2.getMonth() + '/' + date2.getFullYear(); 
    
    elem.reset();
    
    
    setUserData(username, email, checkInDate, checkOutDate, hotelName, hotelCost, hotelMaxOccupancy, promoCode);
  }
  
  function setUserData(username, email, checkInDate, checkOutDate, hotelName, hotelCost, hotelMaxOccupancy){ 
    
    user.push().set({
      username: username,
      email: email,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      hotelName: hotelName,
      hotelCost: hotelCost,
      hotelMaxOccupancy: hotelMaxOccupancy,
    });
  console.log(username, email, checkInDate, checkOutDate, hotelName, hotelCost, hotelMaxOccupancy);

  sendEmail(username, email, checkInDate, checkOutDate, hotelName, hotelCost, hotelMaxOccupancy);
}

function sendEmail(user, email, checkInDate, checkOutDate, hotelName, hotelCost, hotelMaxOccupancy){
  // let diffDates = parseInt(checkOutDate - checkInDate, 10);
  // let countDays = diffDates/(1000*3600*24);
  
  // let totalCost = countDays * parseInt(hotelCost, 10);
  // console.log(totalCost);
  
  Email.send({
    Host: "smtp.gmail.com",
    Username: "midori9976@gmail.com",
    Password: "HotelMidori9976@",
    // SecureToken: "d6981a23-ae31-4453-8538-dbf1007fd5ee",
    To: email,
    From: "midori9976@gmail.com",
    Subject: `Your hotel has been booked ${user}!`,
    Body: `Hello ${user}, Thank you for reserving a hotel from <strong> ${checkInDate}</strong> to <strong> ${checkOutDate}</strong> <br> Hotel : <strong>${hotelName}</strong> with maximum occupancy of ${hotelMaxOccupancy} <br> Price for one night: ${hotelCost} <br> <strong>Note:</strong> pay 10% within 12 hrs else your reservation will get cancelled`,
  }).then((message)=>{
    // alert("mail sent successfully");
    alert(message);
  })
}

document.querySelector("#book").addEventListener('click', () => {
    alert("Hotel Booked");
})