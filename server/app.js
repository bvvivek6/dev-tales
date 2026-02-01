import express from "express";
import cors from "cors";

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.listen(port, () => {
  console.log("Server is running!");
});
