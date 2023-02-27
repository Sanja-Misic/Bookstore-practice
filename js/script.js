"use strict";

//////////////////////
//// Variables
const searchButton = document.querySelector(".header-search-btn");
const homeNavigation = document.querySelector(".navigation-home");
const booksNavigation = document.querySelector(".navigation-books");
const checkBox = document.querySelector("#check-box");
const checkBoxButton = document.querySelector(".check-box-button");

const homePage = document.querySelector(".home-container");
const booksPage = document.querySelector(".books-container");
const clickedBookPage = document.querySelector(".book-container");

const imputedText = document.querySelector(".header-search-input");

const genreContainer = document.querySelector(".categories-list");

const bestRatingContainer = document.querySelector(".best-rating-item-wrapper");
const mostReviewContainer = document.querySelector(
  ".most-revievs-item-wrapper"
);
const randomGendreHeading = document.querySelector(".section-heading-gendre");
const allBooksContainer = document.querySelector(".all-books-item-wrapper");

const red = "#b52121";
const green = "#225e0c";
const orangeNavigation = "#ea8426";

let randomGenreBooks;
let genreArr = [];
let uniqueGenreArr = [];
let allGenresList;
let clickBooks;
let averageRating;
let ratingElement;
let backButton;
let bookDataArray;
let allBooksData;
let filteredBooks;
let img;

const excludedGenres = [
  "Adult",
  "Adult Fiction",
  "African American Romance",
  "Category Romance",
  "Contemporary Romance",
  "Crime",
  "Erotic Horror",
  "Erotic Romance",
  "Erotica",
  "Gay Erotica",
  "Gay For You",
  "Gay Romance",
  "Horor",
  "Lesbian Fiction",
  "Lesbian Romance",
  "M F M",
  "M F Romance",
  "M M Contemporary",
  "M M F",
  "M M Fantasy",
  "M M Historical Romance",
  "M M M",
  "M M M M",
  "M M Mystery",
  "M M Paranormal",
  "M M Romance",
  "M M Science Fiction",
  "M M Shapeshifters",
  "M M Sports Romance",
  "M M Supernatural",
  "M M Young Adult",
  "Manga Romance",
  "Military Romance",
  "New Adult",
  "New Adult Romance",
  "Romance",
  "Sexuality",
  "Sex Work",
  "Strippers",
  "Young Adult",
  "Young Adult Contemporary",
  "Young Adult Fantasy",
  "Young Adult Historical Fiction",
  "Young Adult Paranormal",
  "Young Adult Romance",
  "Young Adult Science Fiction",
];

/////////////////////////
///// Functions
//navigation
const navigationHendler = (activeBtn, pasiveBtn, activePage, pasivePage) => {
  activeBtn.addEventListener("click", function () {
    activePage.style.display = "flex";
    pasivePage.style.display = "none";
    clickedBookPage.style.display = "none";
    activeBtn.style.color = orangeNavigation;
    pasiveBtn.style.color = "initial";
    imputedText.value = "";
  });
};

//Get best rating books
const bestRatingBooksArr = (array) => {
  let bookDataSortRating = array.slice();
  bookDataSortRating.sort(function (a, b) {
    return b.rating - a.rating;
  });
  return bookDataSortRating.slice(0, 4);
};

//Get most revievs by gender
const mostReviewBooksArr = (array) => {
  // get random genre
  let randomBook = array[Math.floor(Math.random() * array.length)];
  let randomGenres = randomBook.genre.split(",");
  let randomGenre =
    randomGenres[Math.floor(Math.random() * randomGenres.length)];

  //get array of books in random ganre
  let booksInRandomGenre = array.filter((book) =>
    book.genre.includes(randomGenre)
  );
  //sort books by rewiews and get 4 book with best review
  booksInRandomGenre.sort(function (a, b) {
    return b.reviews - a.reviews;
  });
  //set heading based on Genre
  randomGendreHeading.textContent = randomGenre;
  return booksInRandomGenre.slice(0, 4);
};

//Display all Genres on books page
const getAndDisplayGenres = (array) => {
  // get every genre for all books page
  array.forEach((element) => {
    let elementArr = element.genre.split(",");
    genreArr = genreArr.concat(elementArr);
  });

  //display all genres and all books
  uniqueGenreArr = [...new Set(genreArr)];
  let spliceArr = uniqueGenreArr.sort();
  spliceArr.splice(0, 1);

  spliceArr.forEach((genre) => {
    const html = `<li class="categories-list-item">${genre}</li>`;
    genreContainer.insertAdjacentHTML("beforeend", html);
  });
};

//Display Books
const bestRatingText = (book) =>
  `<div class="item-rating">Rating: ${book.rating}</div>`;
const mostReviewText = (book) =>
  `<div class="item-reviews"> Reviews: ${book.reviews}</div>`;
const allBooksText = (book) =>
  `<div class="item-rating">Rating: ${book.rating}</div> <div class="item-reviews">Reviews: ${book.reviews}</div>`;
const imgClass = "all-books-item";

const displayBooks = (container, array, text, imgStyle) => {
  container.innerHTML = "";
  array.forEach(function (book) {
    whenNoImgInApi(book);
    const html = `<div class="item ${imgStyle}">
        <img src="${img}" alt="" class="item-img ${imgStyle}"> 
        <div class="item-info-wrap">
        <div class="item-heading"> ${book.title}</div>
        <div class="item-rating-reviews">
            ${text(book)}
        </div>
        </div>
    </div>`;
    container.insertAdjacentHTML("beforeend", html);
  });
};

//pokusavala sam ali ne mogu iz niza nego moram iz dom-a da vadim elemnte jer addEventListener ne radi na necemu sto nije DOM
//Click on book
const displayClickedBook = (array, booksContainer, page) => {
  clickBooks = booksContainer.querySelectorAll(".item");

  clickBooks.forEach((book, i) =>
    book.addEventListener("click", function () {
      clickedBookPage.innerHTML = "";
      clickedBookPage.style.display = "block";
      page.style.display = "none";

      whenNoImgInApi(array[i]);

      const html = `<div class="book-info-and-img">
            <img src="${img}" class="book-img">
            <div class="book-info">
                <h2 class="book-info-title">${array[i].title}</h2>
                <div class="book-info-wrapper">
                    <div class="book-info-items-wrapper">
                        <p class="book-info-item-1">Author:</p>
                        <p class="book-info-item-1">Format:</p>
                        <p class="book-info-item-1">Genre:</p>
                        <p class="book-info-item-1">Pages:</p>
                        <p class="book-info-item-1">Rating:</p></div>
                    <div class="book-info-items-wrapper">
                        <p class="book-info-item-2">${array[i].author}</p>
                        <p class="book-info-item-2">${array[i].bookformat}</p>
                        <p class="book-info-item-2">${array[i].genre}</p>
                        <p class="book-info-item-2">${array[i].pages}</p>
                        <p class="book-info-item-2 book-info-item-2-rating">${array[i].rating}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="book-description">
            <p class="book-description-heading">Description</p>
            <p class="book-description-text">${array[i].desc}</p>
        </div>
        <button class="back-button"> Back &larr; </button>`;

      clickedBookPage.insertAdjacentHTML("beforeend", html);

      //Color element according to rating
      ratingElement = document.querySelector(".book-info-item-2-rating");
      if (array[i].rating > averageRating) {
        ratingElement.style.backgroundColor = green;
      } else if (array[i].rating < averageRating) {
        ratingElement.style.backgroundColor = red;
      }

      //Back btn functionality
      backButton = document.querySelector(".back-button ");
      backButton.addEventListener("click", function () {
        clickedBookPage.style.display = "none";
        page.style.display = "flex";
      });
    })
  );
};

//When no img in API
const whenNoImgInApi = (book) => {
  if (book.img === "") {
    img = "book.png";
  } else {
    img = book.img;
  }
};

//get all rating and calculate average
const calculateAverageRating = (array) => {
  const ratings = array.map((book) => book.rating);
  averageRating = (
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  ).toFixed(2);
};

//search functionality
const searchHendler = (array) => {
  searchButton.addEventListener("click", function () {
    homePage.style.display = "none";
    booksPage.style.display = "flex";

    if (imputedText.value) {
      const searchTerm = imputedText.value.toLowerCase();
      const filterBooks = array.filter((book) => {
        const bookTitle = book.title.toString().toLowerCase();
        return bookTitle.includes(searchTerm);
      });

      if (filterBooks.length > 0) {
        displayBooks(allBooksContainer, filterBooks, allBooksText, imgClass);
        displayClickedBook(filterBooks, allBooksContainer, booksPage);
      } else {
        allBooksContainer.innerHTML = `<div class="wrong-input">
        <p class="wrong-input-text"> You have entered a title that does not exist!</p>
        <p class="wrong-input-text"> Try again!</p> </div>`;
      }
    } else {
      allBooksContainer.innerHTML = `<div class="wrong-input">
      <p class="wrong-input-text"> You have not entered any search text!</p>
      <p class="wrong-input-text"> Please enter what you want to search!</p> </div>`;
    }
  });
};

//////////////////////////////
//General function
const generalHendler = (booksArray) => {
  //// navigation funtionality
  navigationHendler(homeNavigation, booksNavigation, homePage, booksPage);
  navigationHendler(booksNavigation, homeNavigation, booksPage, homePage);

  booksNavigation.addEventListener("click", function () {
    displayBooks(allBooksContainer, booksArray, allBooksText, imgClass);
    displayClickedBook(booksArray, allBooksContainer, booksPage);
  });

  //display best rating Books
  displayBooks(
    bestRatingContainer,
    bestRatingBooksArr(booksArray),
    bestRatingText
  );

  //display most review books
  randomGenreBooks = mostReviewBooksArr(booksArray);
  displayBooks(mostReviewContainer, randomGenreBooks, mostReviewText);

  //display all genres and all books
  getAndDisplayGenres(booksArray);
  displayBooks(allBooksContainer, booksArray, allBooksText, imgClass);

  //click on genre
  const genres = genreContainer.querySelectorAll(".categories-list-item");
  genres.forEach((genre) => {
    genre.addEventListener("click", function () {
      let booksClickedGenre = booksArray.filter((book) =>
        book.genre.includes(genre.textContent)
      );
      displayBooks(
        allBooksContainer,
        booksClickedGenre,
        allBooksText,
        imgClass
      );
      displayClickedBook(booksClickedGenre, allBooksContainer, booksPage);
      imputedText.value = "";
    });
  });
  //Click on "all genre"
  allGenresList = document.querySelector(".categories-list-item-all");
  allGenresList.addEventListener("click", function () {
    displayBooks(allBooksContainer, booksArray, allBooksText, imgClass);
    displayClickedBook(booksArray, allBooksContainer, booksPage);
  });

  displayClickedBook(
    bestRatingBooksArr(booksArray),
    bestRatingContainer,
    homePage
  );
  displayClickedBook(randomGenreBooks, mostReviewContainer, homePage);
  displayClickedBook(booksArray, allBooksContainer, booksPage);

  //search
  searchHendler(booksArray);

  //average rating
  calculateAverageRating(booksArray);
};

////////////////////////////////////
//Default navigation color
homeNavigation.style.color = orangeNavigation;

/////////////////////////////////////
////Get Books
const getBooks = async function (books) {
  const response = await fetch("./data/data.json");
  const data = await response.json();
  let bookData = data.results;

  allBooksData = bookData;

  filteredBooks = bookData.filter(
    (book) => !excludedGenres.some((genre) => book.genre.includes(genre))
  );

  //display array depend on check box
  const checkBoxHendler = () => {
    imputedText.value = "";
    genreContainer.innerHTML = "";
    genreArr = [];
    uniqueGenreArr = [];

    if (checkBox.checked) {
      generalHendler(allBooksData);
    } else {
      generalHendler(filteredBooks);
    }
  };
  checkBox.addEventListener("click", checkBoxHendler);

  //default display filtered books
  if (!checkBox.checked) {
    generalHendler(filteredBooks);
  }
};

getBooks();
