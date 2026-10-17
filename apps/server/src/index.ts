import express from "express";

const app = express();
const PORT = 3000;

app.get("/health", (req, res) => {
  res.send({ status: "healthy" });
});

app.head("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server Listening at PORT: ${PORT}`);
});
