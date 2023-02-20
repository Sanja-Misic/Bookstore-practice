'use strict';
const homePage = document.querySelector('.home-container');
const booksPage = document.querySelector('.books-container');
const clickedBookPage = document.querySelector('.book-container');

const imputedText = document.querySelector('.header-search-input');


const genreContainer = document.querySelector('.categories-list');
const genreListItems = document.querySelectorAll('.categories-list-item');
const bestRatingContainer = document.querySelector('.best-rating-item-wrapper');
const mostReviewContainer = document.querySelector(
  '.most-revievs-item-wrapper'
);
const allBooksContainer = document.querySelector('.all-books-item-wrapper');

const homeNavigation = document.querySelector('.navigation-home');
const booksNavigation = document.querySelector('.navigation-books');

const randomGendreHeading = document.querySelector('.section-heading-gendre');

const searchButton = document.querySelector('.header-search-btn')

const red = "ff0000"
const green = "008000"

let genreArr = [];
let uniqueGenreArr = [];
let averageRating;



//click on book functionality
////Get Books
const getBooks = async function (books) {
  const response = await fetch(
    './data/data.json'
    // 'https://api.jsonbin.io/v3/b/63a0e753dfc68e59d56c71ec/latest',
    // {
    //   method: 'GET',
    //   headers: {
    //     'X-Master-Key':
    //       '$2b$10$viPOiL/.5Te1ctsEnmquLuBHKGeK09Vp0SxT2m7wkH68/e1537nUK',
    //   },
    // }
  );

  const data = await response.json();

  const bookData = data.results;
  console.log(bookData);

  //// navigation funtionality
  homeNavigation.addEventListener('click', function () {
    homePage.style.display = 'flex';
    booksPage.style.display = 'none';
    clickedBookPage.style.display = 'none';
  });
  
  booksNavigation.addEventListener('click', function () {
    homePage.style.display = 'none';
    booksPage.style.display = 'flex';
    clickedBookPage.style.display = 'none';
     displayBooks(bookData)
  });

  ////HOME PAGE
  ////sort by rating
  let bookDataSortRating = bookData.slice();

  bookDataSortRating.sort(function (a, b) {
    return b.rating - a.rating;
  });
  let bestRatingBooks = bookDataSortRating.slice(0, 4);

  displayBestRatingBooks(bestRatingBooks);

  ////sort most revievs by gender
  // get random genre
  let randomBook = bookData[Math.floor(Math.random() * bookData.length)];
  let randomGenres = randomBook.genre.split(',');
  let randomGenre =
    randomGenres[Math.floor(Math.random() * randomGenres.length)];
  // console.log(randomGenre)

  //get array of books in random ganre
  let booksInRandomGenre = bookData.filter(book =>
    book.genre.includes(randomGenre)
  );
  // console.log(booksInRandomGenre)

  //sort books by rewiews and get 4 book with best review
  booksInRandomGenre.sort(function (a, b) {
    return b.reviews - a.reviews;
  });
  let mostReviewBooks = booksInRandomGenre.slice(0, 4);

  displayMostReviewBooks(mostReviewBooks);

  //set heading based on Genre
  randomGendreHeading.textContent = randomGenre;

  ////BOOK PAGE
  // get every genre for all books page
  bookData.forEach(element => {
    let elementArr = element.genre.split(',');
    genreArr = genreArr.concat(elementArr);
  });
  uniqueGenreArr = [...new Set(genreArr)];

  //display all genres and all books
  uniqueGenreArr = [...new Set(genreArr)];
  uniqueGenreArr.sort();
  uniqueGenreArr.forEach(genre => {
    const html = `<li class="categories-list-item">${genre}</li>`;
    genreContainer.insertAdjacentHTML('beforeend', html);
  });

  //click on genre
  const genres = genreContainer.querySelectorAll('.categories-list-item');
  genres.forEach(genre => {
    genre.addEventListener('click', function () {
      let booksClickedGenre = bookData.filter(book =>
        book.genre.includes(genre.textContent)
      );

      displayBooks(booksClickedGenre);
      clickedBookFunction(booksClickedGenre, allBooksContainer, booksPage);
    });
  });

  const allGenresList = document.querySelector('.categories-list-item-all');
  allGenresList.addEventListener('click', function () {
    displayBooks(bookData);
    
    clickedBookFunction(bookData, allBooksContainer, booksPage);
  });

  displayBooks(bookData);
  clickedBookFunction(bestRatingBooks, bestRatingContainer, homePage);
  clickedBookFunction(mostReviewBooks, mostReviewContainer, homePage);
  clickedBookFunction(bookData, allBooksContainer, booksPage);

//////////////////////////proba
 //search functionality
 searchButton.addEventListener('click', function() {
    homePage.style.display = "none"
    booksPage.style.display = "flex"

     if(imputedText.value) {
        const searchTerm = imputedText.value.toLowerCase()
        const filterBooks = bookData.filter(book => {
        const bookTitle = book.title.toString().toLowerCase()
          
        return bookTitle.includes(searchTerm)      
        })
        console.log(filterBooks)
            
        if (filterBooks.length > 0) {
            displayBooks(filterBooks)
        } else {
            booksPage.innerHTML = `<div class="wrong-input">
        <p class="wrong-input-text">You have entered a title that does not exist!</p>
        <p class="wrong-input-text">
            Try again!</p>
        </div>`;
        console.log("wrong title")
    }
    }
})
    ////average rating
    //get all rating and calculate average
    const ratings = bookData.map(book => book.rating);
    averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    console.log(averageRating)
};

getBooks();



/////functions
const displayBestRatingBooks = array => {
  array.forEach(function (book) {
    // console.log(book)
    const html = `<div class="item">
        <img src="${book.img}" alt="" class="item-img"> 
        <div class="item-info-wrap">
        <div class="item-heading"> ${book.title}</div>
        <div class="item-rating-reviews">
            <div class="item-rating">Rating: ${book.rating}</div>
        </div>
        </div>
    </div>`;
    bestRatingContainer.insertAdjacentHTML('beforeend', html);
  });
};

const displayMostReviewBooks = array => {
  array.forEach(function (book) {
    // console.log(book)
    const html = `<div class="item">
       <img src="${book.img}" alt="" class="item-img"> 
       <div class="item-info-wrap">
        <div class="item-heading"> ${book.title}</div>
        <div class="item-rating-reviews">
        <div class="item-reviews"> Reviews: ${book.reviews}</div>
        </div>
        </div>
    </div>`;
    mostReviewContainer.insertAdjacentHTML('beforeend', html);
  });
};

const displayBooks = array => {
  allBooksContainer.innerHTML = '';
  array.forEach(book => {
    const html = `<div class="item all-books-item">
        <img src="${book.img}" alt="" class="item-img all-books-img"> 
        <div class="item-info-wrap">
        <div class="item-heading"> ${book.title}</div>
        <div class="item-rating-reviews">
            <div class="item-rating">Rating: ${book.rating}</div>
            <div class="item-reviews">Reviews: ${book.reviews}</div>
        </div>
        </div>
    </div>`;
    allBooksContainer.insertAdjacentHTML('beforeend', html);
  });
};

const clickedBookFunction = (array, booksContainer, page) => {
  const clickBooks = booksContainer.querySelectorAll('.item');
//   const itemRating = clickedBookPage.querySelector('.book-info-span-rating');
  
  

  clickBooks.forEach((book, i) =>
    book.addEventListener('click', function () {
      clickedBookPage.innerHTML = '';

      clickedBookPage.style.display = 'block';
      page.style.display = 'none';
    // booksPage.style.display = 'none'

  

      const html = `<div class="book-info-wrapper">
            <img src="${array[i].img}" alt="" class="book-info-img">
            <div class="book-info">
                <h2 class="book-info-title">${array[i].title}</h2>
                <p class="book-info-item">Author: <span class="book-info-span">${array[i].author}</span></p>
                <p class="book-info-item">Format: <span class="book-info-span">${array[i].bookformat}</span></p>
                <p class="book-info-item">Genre: <span class="book-info-span">${array[i].genre}</span></p>
                <p class="book-info-item">Pages: <span class="book-info-span">${array[i].pages}</span></p>
                <p class="book-info-item">Rating: <span class="book-info-span-rating">${array[i].rating}</span></p>
            </div>
            </div>
            <div class="book-description">
                <p class="book-description-heading">Description</p>
                <p class="book-description-text">${array[i].desc}</p>
            </div>
            <button class="back-button"> Back &larr; </button>`;

      clickedBookPage.insertAdjacentHTML('beforeend', html);


    //     const ratingElement = document.querySelector('.book-info-span-rating');
    //     const ratingValue = ratingElement ? ratingElement.textContent : '';


      if (array[i].rating > averageRating){
        console.log(array[i].rating, "veci")
        // console.log(itemRating)
        // itemRating.style.backgroundColor = "green"
       } else if (array[i].rating < averageRating){
        console.log(array[i].rating, "manji")
        // itemRating.style.backgroundColor = "red"
       }

    //Back btn functionality
    const backButton = document.querySelector('.back-button ');
    backButton.addEventListener('click', function(){
        clickedBookPage.style.display = 'none';
        page.style.display = 'flex';
    })
    })
  );
};
