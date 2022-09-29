import { google } from "googleapis";
import authCli from "./auth/auth.js";

const corpora = `drive`;
const driveId = `0AEkXI6AMJY0PUk9PVA`;
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
