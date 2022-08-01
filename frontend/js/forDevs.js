// ---------------------------------------------------------------------------------------------------------
  // Your web app's Firebase configuration
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
let hotelDatabase = firebase.database().ref("hotel");

var form = document.querySelector(".add-hotel");


form.addEventListener("submit", setData);

function setData(e) {
    e.preventDefault();

    let hotelName = document.querySelector("#hotel-name").value;
    let hotelMaxOccupancy = document.querySelector("#max-occupancy").value;
    let hotelCost = document.querySelector("#cost").value;
    let image = document.querySelector("#hotel-image").files[0];


    //getting reference to storage in firebase
    let storageRef = firebase.storage().ref("Images/"+image.name);

    // uploading image into the storage
    var uploadTask = storageRef.put(image);

    //just like event listner, listens event of uploading in the storage
    uploadTask.on("state_change",
      function (snap) {
        // colsole logging upload percentage
        console.log((snap.bytesTransferred/snap.totalBytes) * 100);
      },

      // if any error occurs during uploading
      function error(err){
        console.log(err);
      },

      function settingData() {
        //extracting download url of uploaded image to store it in database
        storageRef.getDownloadURL().then((url) => {

          form.reset();
          //setting values got from form to the database
          let newHotelInfo = hotelDatabase.push();
      
          newHotelInfo.set({
              name : hotelName,
              maxOccupancy : hotelMaxOccupancy,
              cost : hotelCost,
              link : url,
          });
        })
      }

    );
    
    
    console.log(hotelName, hotelMaxOccupancy, hotelCost, image.name);
}
