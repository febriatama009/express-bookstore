const bodyParser = require("body-parser");
const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express();

public_users.use(bodyParser.json());

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "Register success. Please login with credentials" });
    } else {
      return res.status(409).json({ message: "User already exist" });
    }
  }
  return res
    .status(400)
    .json({ message: "Invalid credentials for registration" });
});

// Get All Books
public_users.get("/", async function (req, res) {
  //Write your code here
  try {
    const allBooks = await new Promise((resolve) => {
      setTimeout(() => {
        const book = Object.values(books);
        resolve(book);
      }, 1000);
    });

    return res.status(200).json({ books: allBooks });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const findBookByISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  });

  findBookByISBN
    .then((book) => {
      return res.status(200).json({ book: book });
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;

  // Find all books with the given author
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );

  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;

  // Find all books with the given title
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );

  if (booksByTitle.length > 0) {
    return res.status(200).json({ books: booksByTitle });
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists in the 'books' object
  if (books[isbn]) {
    const bookReviews = books[isbn].reviews;
    return res.status(200).json({ reviews: bookReviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
