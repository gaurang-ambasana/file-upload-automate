import express from "express";
import bodyParser from "body-parser";
import multer, { memoryStorage } from "multer";
import { config } from "dotenv";
import { uploadCsv } from "./helpers/helpers.js";

config();

const { PORT } = process.env;
const app = express();

const multerMid = multer({
  storage: memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});

app.disable("x-powered-by");
app.use(multerMid.single("file"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/uploads", async ({ file, body: { name, mimeType } }, res, next) => {
  try {
    const { publicUrl, msg } = await uploadCsv(file, name, mimeType);
    res.status(200).json({
      msg,
      publicUrl,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({
    erorr: err,
    msg: "Internal Server Error!",
  });
  next();
});

app.get("/", (req, res) => res.status(200).send("API is running..."));

app.listen(PORT, () =>
  console.log(`Server is listening to all the requests from PORT: ${PORT}`)
);
