var submitBtn = document.getElementById("btn");

var staffKey = "a2s3d9f"

var authenticateUser = () => {
    const userInput = document.getElementById("staff-key").value;
    if(userInput === staffKey){
        window.open("../html/forDevs.html");
    }
    else{
        alert("Enter the valid key");
    }
}


submitBtn.addEventListener("click", authenticateUser);