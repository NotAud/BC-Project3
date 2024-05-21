import express from "express";
import router from "./api/router.ts";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
