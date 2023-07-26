const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express();
const bodyParser = require("body-parser");

//store users
let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (userWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.use(bodyParser.json());

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  //error
  if (!username || !password) {
    return res.status(404).json({ message: "Error Log in" });
  }

  //success
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).send("Success Login");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username & Password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewData = req.params;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Save the original reviews to check if a new review was added
  const originalReviews = books[isbn].reviews;

  // Update the reviews of the corresponding book in the 'books' object
  books[isbn].reviews = { ...originalReviews, ...reviewData };

  // Check if a new review was added
  const newReviewsAdded = Object.keys(reviewData).some(
    (key) => originalReviews[key] !== reviewData[key]
  );
  if (newReviewsAdded) {
    return res.status(200).json({ message: "Review successfully added" });
  } else {
    return res
      .status(400)
      .json({ message: "Review data unchanged or invalid" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
