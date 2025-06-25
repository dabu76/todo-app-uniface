const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("서버 잘 작동 중!");
});

app.listen(3001, () => {
  console.log("✅ 서버가 http://localhost:3001 에서 실행 중");
});
