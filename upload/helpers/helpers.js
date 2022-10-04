import { format } from "util";
import { config } from "dotenv";
import storage from "../config/index.js";

config();

const csvBucket = storage.bucket(process.env.BUCKET_NAME);

export const uploadCsv = (file, name, mimeType) =>
  new Promise((resolve, reject) => {
    const { buffer } = file;

    const blob = csvBucket.file(name.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: mimeType,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${csvBucket.name}/${blob.name}`
        );
        resolve({
          msg: "Upload Success!",
          publicUrl,
        });
      })
      .on("error", (err) => {
        console.error(err.message);
        reject(`Unable to upload, something went wrong`);
      })
      .end(buffer);
  });
