import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

config();

const storage = new Storage({
  keyFilename: path.join(__dirname, "./credentials/service_account.json"),
  projectId: process.env.GCP_PROJECT_ID,
});

export default storage;
