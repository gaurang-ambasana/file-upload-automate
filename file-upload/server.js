import express from "express";
import bodyParser from "body-parser";
import multer, { memoryStorage } from "multer";
import { uploadCsv } from "./utils/helper.js";

const app = express();
const { PORT } = process.env;

const multerMid = multer({
  storage: memoryStorage(),
});

app.disable("x-powered-by");
app.use(multerMid.single("file"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/upload", async (req, res, next) => {
  try {
    const { file } = req;
    const csvUrl = await uploadCsv(file);

    res.status(200).json({
      message: "Success!",
      payload: csvUrl,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.get("/get-files-list", async (req, res) => {
  const files = await listFiles();
  res.status(200).json({ files });
});

app.get("/", (req, res) => res.status(200).send("API is running..."));

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.stack,
    message: "Internal server error!",
  });
  next();
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
