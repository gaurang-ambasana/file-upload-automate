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

do {
  googleDrive.files.list(
    {
      corpora,
      driveId,
      supportsAllDrives,
      includeItemsFromAllDrives,
      q: query,
      pageToken,
    },
    (err, res) => {
      if (err) console.error(err.stack);
      else {
        const { files, nextPageToken } = res.data;
        pageToken = nextPageToken;
        console.log(files);
      }
    }
  );
} while (pageToken);
