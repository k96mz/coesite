const express = require("express");
const session = require("express-session");

const app = express();

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10000 },
  })
);

app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`You have visited this page ${req.session.views} times.`);
  } else {
    req.session.views = 1;
    res.send("Welcome! Refresh the page to start counting visits.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
