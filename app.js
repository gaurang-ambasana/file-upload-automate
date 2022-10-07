import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import {
  getFileContent,
  listCsv,
  uploadCsv,
} from "./upload/helpers/helpers.js";

config();

const { PORT } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/fetch-csv-and-upload", async ({ query: { driveId } }, res, next) => {
  try {
    const payload = [];
    const allCsv = await listCsv(driveId);

    for (let i = 0, n = allCsv.length; i < n; i++) {
      const { id: fileId, mimeType, name: fileName } = allCsv[i];

      const { data } = await getFileContent(fileId);

      const file = await new Blob([data]).arrayBuffer();

      const { msg, publicUrl } = await uploadCsv(file, fileName, mimeType);

      if (publicUrl) {
        console.log(`"${fileName}" uploaded successfully.`);
        payload.push({ name: fileName, msg, publicUrl });
      } else {
        console.log(`"${fileName}" upload failed.`);
        payload.push({ name: fileName, err: msg });
      }
    }

    res.status(200).json({
      status: "OK!",
      payload,
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
