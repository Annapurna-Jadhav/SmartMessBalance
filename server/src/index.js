
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

import {app} from "./app.js";
console.log("ENV CHECK →", {
  project: process.env.GCP_PROJECT_ID,
  creds: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
console.log("Gemini key loaded:", process.env.GEMINI_API_KEY?.slice(0, 8));





app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  

});
