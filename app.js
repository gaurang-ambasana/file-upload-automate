import { config } from "dotenv";
import { google } from "googleapis";
import authCli from "./auth/auth.js";

config();

const corpora = `drive`;
const driveId = process.env.DRIVE_ID;
const supportsAllDrives = true;
const includeItemsFromAllDrives = true;

let pageToken;

const googleDrive = google.drive({ version: "v3", auth: authCli });

const query = `mimeType: 'text/csv'`;

const fileIds = [];

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
  fileIds.push(...files.map(({ id }) => id));
} while (pageToken);

for (let i = 0, n = fileIds.length; i < n; i++) {
  const { data } = await googleDrive.files.get({
    fileId: fileIds[i],
    supportsAllDrives,
    alt: "media",
  });

  const blob = new Blob([data]);
  console.log(blob);
}
