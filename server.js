import express from "express";
import bodyParser from "body-parser";
import api from "./api/index.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api", api);
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
