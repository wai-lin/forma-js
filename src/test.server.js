const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());

app.use("*", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const statusCode = Number(req.body?.statusCode) || 200;
  res.status(statusCode).json({
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
});

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
