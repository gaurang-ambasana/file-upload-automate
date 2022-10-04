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

allCsv.forEach(async ({ id: fileId, mimeType, name: fileName }) => {
  try {
    const { data } = await googleDrive.files.get({
      fileId,
      supportsAllDrives,
      alt: "media",
    });

    const blob = new Blob([data]);

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("name", fileName);
    formData.append("mimeType", mimeType);

    const { status, msg, publicUrl } = await fetch(process.env.UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (status === 200) console.log(`"${fileName}" uploaded successfully`);
    else console.error(`"${fileName}" upload failed, ${msg}`);
  } catch (e) {
    console.error(e);
  }
});
