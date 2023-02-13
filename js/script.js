"use strict"

const genreContainer = document.querySelector(".categories-list")

let genreArr = [];
let uniqueGenreArr = []


////Get Books
const getBooks = async function(books){
    const response = await fetch('https://api.jsonbin.io/v3/b/63a0e753dfc68e59d56c71ec/latest',{
        method: 'GET',
        headers: {'X-Master-Key': '$2b$10$viPOiL/.5Te1ctsEnmquLuBHKGeK09Vp0SxT2m7wkH68/e1537nUK'}})
        
        const data = await response.json()
        
        const bookData = data.record.results

    // get every gendre
    bookData.forEach(element => {
        let elementArr = element.genre.split(",");
        genreArr = genreArr.concat(elementArr);
    });

    uniqueGenreArr = [...new Set(genreArr)];

    dsplayGenresFunction();
}

getBooks()

// display genres on page
 const dsplayGenresFunction = () => { 
    uniqueGenreArr = [...new Set(genreArr)]
    uniqueGenreArr.sort();
    uniqueGenreArr.forEach(genre => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<li class="categories-list-item">${genre}</li>`
        genreContainer.appendChild(listItem)
    })
 }
