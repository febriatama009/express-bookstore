const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userWithSameName = users_data.filter((user) => {
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
  let validUsers = users_data.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

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
  const reviews = req.body;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews = { ...books[isbn].reviews, ...reviewData };
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
