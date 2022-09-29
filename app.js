import { config } from "dotenv";
import { google } from "googleapis";
import authCli from "./auth/auth.js";

config();

const corpora = `drive`;
const driveId = process.env.DRIVE_ID;
const supportsAllDrives = true;
const includeItemsFromAllDrives = true;

const googleDrive = google.drive({ version: "v3", auth: authCli });

googleDrive.files.list(
  { corpora, driveId, supportsAllDrives, includeItemsFromAllDrives },
  (err, res) => {
    if (err) console.error(err.stack);
    else {
      const { files } = res.data;
      console.log(files);
    }
  }
);
