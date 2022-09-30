import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";
import service_account from "../auth/credentials/service_account.json" assert { type: "json" };

config();

const storage = new Storage({
  keyFilename: service_account,
  projectId: process.env.GCP_PROJECT_ID,
});

export default storage;
