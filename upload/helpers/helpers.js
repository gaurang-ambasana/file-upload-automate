import { format } from "util";
import { config } from "dotenv";
import { google } from "googleapis";
import authCli from "../auth/auth.js";
import storage from "../config/index.js";

config();

const googleDrive = google.drive({ version: "v3", auth: authCli });
const corpora = `drive`;
const supportsAllDrives = true;
const includeItemsFromAllDrives = true;

const csvBucket = storage.bucket(process.env.BUCKET_NAME);

export const getFileContent = async (fileId) =>
  await googleDrive.files.get({
    fileId,
    supportsAllDrives,
    alt: "media",
  });

export const listCsv = async (driveId) => {
  try {
    let pageToken;

    const query = `mimeType: 'text/csv'`;

    const allCsv = [];

    do {
      const {
        data: { files },
      } = await googleDrive.files.list({
        corpora,
        driveId,
        supportsAllDrives,
        includeItemsFromAllDrives,
        q: query,
        pageToken,
      });
      allCsv.push(
        ...files.map(({ id, name, mimeType }) => ({ id, name, mimeType }))
      );
    } while (pageToken);

    return allCsv;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const uploadCsv = (content, name, mimeType) =>
  new Promise((resolve, reject) => {
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
        reject({ msg: `Unable to upload, something went wrong` });
      })
      .end(content);
  });
