import { config } from "dotenv";
import { format } from "util";
import storage from "../config.js";

config();

const bucket = storage.bucket(process.env.BUCKET_NAME);

export const uploadCsv = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer, mimetype } = file;

    const blob = bucket.file(originalname.replaceAll(` `, `_`));
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: mimetype,
    });

    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    blobStream
      .on("finish", resolve(publicUrl))
      .on("error", reject(`Unable to upload image, something went wrong`))
      .end(buffer);
  });
