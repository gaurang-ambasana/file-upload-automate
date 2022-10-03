import { config } from "dotenv";
import { google } from "googleapis";
import authCli from "./auth/auth.js";
import { createReadStream } from "fs";

config();

const corpora = `drive`;
const driveId = process.env.DRIVE_ID;
const supportsAllDrives = true;
const includeItemsFromAllDrives = true;

let pageToken;

const googleDrive = google.drive({ version: "v3", auth: authCli });

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

for (let i = 0, n = allCsv.length; i < n; i++) {
  const { id, mimeType, name } = allCsv[i];

  const { data } = await googleDrive.files.get({
    fileId: id,
    supportsAllDrives,
    alt: "media",
  });

  const blob = new Blob([data]);

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("name", name);
  formData.append("mimeType", mimeType);

  fetch("http://localhost:3000/uploads", {
    method: "POST",
    body: formData,
  })
    .then(({ status, msg }) =>
      status === 200
        ? console.log(`"${name}" uploaded successfully`)
        : console.log(`"${name}" upload failed, ${msg}`)
    )
    .catch(console.error);
}
