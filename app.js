import { config } from "dotenv";
import { google } from "googleapis";

config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

const authCli = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
authCli.setCredentials({ refresh_token: REFRESH_TOKEN });

const googleDrive = google.drive({ version: "v3", auth: authCli });

googleDrive.files.list(
  {
    corpora: "drive",
    driveId: "0AEkXI6AMJY0PUk9PVA",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  },
  (err, { data }) => {
    if (err) console.error(err.stack);
    else console.log(data.files);
  }
);
