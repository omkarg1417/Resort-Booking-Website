const checkInDate = document.querySelector('#check-in-date');
const checkOutDate = document.querySelector('#check-out-date');
const book = document.querySelector('#book');

const backendUrl = "http://localhost:8000/";


const loadHotels = async () => {

    fetch(backendUrl + 'user/getHotels')
    .then(data => data.json())
    .then(res => {
        res.forEach(element => {
            
        });
    })
    
}


const bookHotel = (e) => {
    e.preventDefault();

    if((!checkInDate || !checkOutDate) || checkInDate <= new Date() || checkOutDate < checkInDate) {
        alert("Enter valid dates");
        return;
    }

    await fetch(backendUrl + 'user/book-hotel/')
    
}

book.addEventListener('click', bookHotel);