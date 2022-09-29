import { config } from "dotenv";
import { google } from "googleapis";

config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

const authCli = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
authCli.setCredentials({ refresh_token: REFRESH_TOKEN });

export default authCli;
