# Download the 20 transcripts on a Windows PC

YouTube blocks the cloud server Claude runs on, so the transcripts have to be downloaded from a normal home connection. It takes about 10 minutes of waiting and about 20-25 minutes of clicking.

## 1. Install Node.js (once)

1. Go to https://nodejs.org and download the **LTS** version for Windows.
2. Run the installer and keep clicking **Next** with the default options, then **Finish**.

## 2. Download this project

1. Open this link: https://github.com/Daniel-Awobodu/portfolio/archive/refs/heads/claude/gallant-pasteur-rg75ae.zip
2. When the zip has downloaded, right-click it and choose **Extract All**, then **Extract**.
3. In the extracted folder, open `.claude`, then `skills`, then `cv-resume-writer`.

## 3. Pick the 20 videos

1. Click the address bar at the top of File Explorer (where the folder path is shown), type `cmd` and press **Enter**. A black Command Prompt window opens in this folder.
2. Paste these two commands **one at a time** (Ctrl+V or right-click to paste), pressing **Enter** after each and waiting for it to finish:

   ```
   npm ci
   ```

   ```
   node scripts/fetch_transcripts_browser.cjs --list
   ```

   The first downloads about 4 MB. The second opens an Edge window that checks each video's date and language by itself (about 10 minutes). Leave it alone. If Windows asks whether to allow network access, click **Allow**.
3. When it finishes, a page called **Save these 20 transcripts** opens in your browser. (It is also saved as `out\save-these-20.html`.)

## 4. Save the transcripts

YouTube refuses transcripts to a browser that a program is controlling, so this part is done in your normal browser, about a minute per video. The page has the steps:

1. Press **Ctrl+Shift+B** to show the favourites bar and drag the red **Save transcript** button onto it.
2. Click a video in the list. If a cookie message appears, click **Reject all**. Then click **Save transcript** on the favourites bar. A `.txt` file downloads and a message says **Saved**.
3. Close the tab, tick the box, and do the next one.

## 5. Send them to Claude

Open your **Downloads** folder, select the 20 `.txt` files, right-click and choose **Compress to ZIP file** (on Windows 10: **Send to > Compressed (zipped) folder**). Attach the zip in the chat with Claude.

## If something goes wrong

- **"STOP: YouTube is showing its 'unusual traffic' page"**: wait a few hours and run the last command again. It carries on from where it stopped.
- **The Save transcript button says the transcript didn't load**: click **...more** under the video, then **Show transcript**, wait for the text to appear on the right, and click **Save transcript** again.
- **Any other error**: copy the text from the black window and paste it in the chat.
