const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// セッション設定
app.use(
  session({
    secret: "secret-key", // セッション暗号化キー
    resave: false, // セッションが変更されなくても保存するか
    saveUninitialized: false, // 未初期化のセッションを保存するか
    cookie: { maxAge: 60000 }, // セッションの有効期限（ミリ秒）
  })
);

// connect-flash の設定
app.use(flash());

// ルートハンドラ
app.get("/", (req, res) => {
  // フラッシュメッセージを設定
  req.flash("info", "Welcome to the site!");
  res.redirect("/show-message");
});

app.get("/show-message", (req, res) => {
  // フラッシュメッセージを取得
  const message = req.flash("info");
  // console.log(`message: ${message[0]}`);
  res.send(message.length > 0 ? message[0] : "No messages");
});

// サーバー起動
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
