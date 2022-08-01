// //hovering changes;

// var dc = document;

// let headNav = dc.getElementsByClassName("head-nav");


// var homeStayHover = function (){
//     dc.getElementById("home-stay").style.borderBottom = "2px solid white";
//     dc.getElementById("home-stay").style.borderBottomColor = "white";

//     dc.getElementById("home-explore").style.color="gray";
//     dc.getElementById("home-dine").style.color="gray";
//     dc.getElementById("home-gallery").style.color="gray";
// };
// dc.getElementById("home-stay").addEventListener("mouseover",  homeStayHover, true)  ;

// if(dc.getElementById("home-stay").mouseout == true)
//     dc.getElementById("home-stay").removeEventListener("mouseover", homeStayHover);


var dc = document;
var homeStay = dc.getElementById("home-stay");
var homeExplore = dc.getElementById("home-explore");
var homePackage = dc.getElementById('home-package');
var homeDine = dc.getElementById("home-dine");
var homeGallery = dc.getElementById("home-gallery");
var homeBook = dc.getElementById("home-book");

// left head nav mouseover events
homeStay.onmouseover = ()=>{
    homeExplore.style.color = "gray";
    homePackage.style.color = 'gray';
}
homeStay.onmouseleave = ()=>{
    homeExplore.style.color = "white";
    homePackage.style.color = 'white';
}

homeExplore.onmouseover = ()=>{
    homeStay.style.color = "gray";
    homePackage.style.color = "gray";
}
homeExplore.onmouseleave = ()=>{
    homeStay.style.color = "white";
    homePackage.style.color = "white";
}

homePackage.onmouseover = ()=>{
    homeStay.style.color = "gray";
    homeExplore.style.color = "gray";
}
homePackage.onmouseleave = ()=>{
    homeStay.style.color = "white";
    homeExplore.style.color = "white";
}



// right head nav mouseover events
homeDine.onmouseover = ()=>{
    homeGallery.style.color = "gray";
    homeBook.style.color = "gray";
}
homeDine.onmouseleave = ()=>{
    homeGallery.style.color = "white";
    homeBook.style.color = "white";
}

homeGallery.onmouseover = ()=>{
    homeDine.style.color = "gray";
    homeBook.style.color = "gray";
}
homeGallery.onmouseleave = ()=>{
    homeDine.style.color = "white";
    homeBook.style.color = "white";
}

homeBook.onmouseover = ()=>{
    homeDine.style.color = "gray";
    homeGallery.style.color = "gray";
}
homeBook.onmouseleave = ()=>{
    homeDine.style.color = "white";
    homeGallery.style.color = "white";
}

