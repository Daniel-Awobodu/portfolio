# Download the 20 transcripts on a Windows PC

YouTube blocks the cloud server Claude runs on, so the transcripts have to be downloaded from a normal home connection. It takes about 10 minutes of your time and about 20-30 minutes of waiting.

## 1. Install Node.js (once)

1. Go to https://nodejs.org and download the **LTS** version for Windows.
2. Run the installer and keep clicking **Next** with the default options, then **Finish**.

## 2. Download this project

1. Open this link: https://github.com/Daniel-Awobodu/portfolio/archive/refs/heads/claude/gallant-pasteur-rg75ae.zip
2. When the zip has downloaded, right-click it and choose **Extract All**, then **Extract**.
3. In the extracted folder, open `.claude`, then `skills`, then `cv-resume-writer`.

## 3. Run it

1. Click the address bar at the top of File Explorer (where the folder path is shown), type `cmd` and press **Enter**. A black Command Prompt window opens in this folder.
2. Paste these three commands one at a time (Ctrl+V or right-click to paste), pressing **Enter** after each and waiting for it to finish:

   ```
   npm install playwright@1.63.0
   npx playwright install chromium
   node scripts/fetch_transcripts_browser.cjs
   ```

   If Windows asks whether to allow network access, click **Allow**.
3. Leave the window open. Lines like `got 05/20: ...` appear as transcripts are saved. When it says **Done!**, it's finished.

## 4. Send the results to Claude

In the `cv-resume-writer` folder, right-click the new `out` folder and choose **Compress to ZIP file** (on Windows 10: **Send to > Compressed (zipped) folder**). Attach `out.zip` in the chat with Claude.

## If something goes wrong

- **"STOP: YouTube is showing its 'unusual traffic' page"**: wait a few hours and run the last command again. It carries on from where it stopped.
- **"STOP: the transcript panel wasn't found"**: send the `out` folder anyway. It contains screenshots that show Claude what to fix.
- **Any other error**: copy the text from the black window and paste it in the chat.
