# That's What She Said! - Podcast Landing Page

A beautiful, modern landing page for "That's What She Said" podcast with Christiana Malacara.

## Quick Start

```bash
# Install dependencies
npm install

# Compile SCSS and start dev server
npm run dev
```

Visit `http://localhost:3000` to view the site.

## Development

- `npm start` - Start Express server only
- `npm run scss` - Watch and compile SCSS
- `npm run dev` - Run both concurrently

## Project Structure

```
twsspod/
├── index.html          # Main landing page
├── scholarship.html    # Scholarship gala page
├── css/               # Compiled CSS (generated)
├── scss/              # SCSS source files
│   ├── main.scss      # Main styles
│   └── scholarship.scss
├── js/
│   └── main.js        # JavaScript with Intersection Observer
├── assets/            # Images and media
└── server.js          # Express dev server
```

## Deployment to GitHub Pages

1. Ensure all SCSS is compiled to CSS: `npx sass scss:css`
2. Push to GitHub
3. Go to Settings > Pages
4. Set source to main branch, root folder
5. Your site will be live at `https://username.github.io/repo-name`

---

## Setup Guide

### 1. Google Calendar Integration

The calendar pulls events from a Google Calendar. To set this up:

#### Step 1: Create a Google Calendar
1. Go to [Google Calendar](https://calendar.google.com)
2. Create a new calendar for your events
3. Click the calendar settings (gear icon)
4. Under "Integrate calendar", copy the **Calendar ID**

#### Step 2: Get a Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the **Google Calendar API**
4. Go to Credentials > Create Credentials > API Key
5. (Optional) Restrict the key to Calendar API and your domain

#### Step 3: Make Calendar Public
1. In Google Calendar settings
2. Under "Access permissions", check "Make available to public"
3. Set to "See all event details"

#### Step 4: Update the Code
Edit `js/main.js` and replace the placeholder values:

```javascript
const GOOGLE_CALENDAR_ID = 'your-calendar-id@group.calendar.google.com';
const GOOGLE_API_KEY = 'your-api-key';
```

---

### 2. Mailing List (Google Docs/Sheets Integration)

The subscribe form can write directly to a Google Sheet/Doc via Google Apps Script.

#### Step 1: Create a Google Sheet
1. Create a new Google Sheet
2. Name the columns: `Timestamp`, `Name`, `Email`
3. Note the Sheet ID from the URL

#### Step 2: Create a Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the code with:

```javascript
const SHEET_ID = 'your-sheet-id-here';

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput('Mailing list endpoint')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Replace `your-sheet-id-here` with your actual Sheet ID

#### Step 3: Deploy as Web App
1. Click Deploy > New deployment
2. Select type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. Deploy and copy the Web App URL

#### Step 4: Update the Code
Edit `js/main.js` and replace:

```javascript
const GOOGLE_SCRIPT_URL = 'your-web-app-url-here';
```

#### Security Note
Only share the Google Sheet with people who should see subscriber data. The Apps Script runs with your permissions.

---

### 3. YouTube Video Embeds

To add real videos, update the podcast cards in `index.html`:

1. Find the video on YouTube
2. Copy the video ID (the part after `v=` in the URL)
3. Replace `PLACEHOLDER_VIDEO_1`, etc. with real IDs:

```html
<div class="podcast-card__placeholder" data-video-id="dQw4w9WgXcQ">
```

When users click, the placeholder will be replaced with the YouTube embed.

---

### 4. Updating Content

#### Adding New Episodes
Edit `index.html` and add/modify podcast cards:

```html
<article class="podcast-card reveal">
  <div class="podcast-card__video">
    <div class="podcast-card__placeholder" data-video-id="YOUR_VIDEO_ID">
      <div class="podcast-card__play">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <span>Watch Episode</span>
    </div>
  </div>
  <div class="podcast-card__content">
    <span class="podcast-card__date">Episode X</span>
    <h3 class="podcast-card__title">Guest Name - Episode Title</h3>
    <p class="podcast-card__excerpt">Brief description...</p>
  </div>
</article>
```

#### Updating Scholarship Details
Edit `scholarship.html` to update:
- Event date and time
- Location (when confirmed)
- Ticket prices
- Sponsorship tiers

---

## Customization

### Colors
Edit the CSS variables in `scss/main.scss`:

```scss
:root {
  --color-pink-light: #FADDE1;
  --color-pink: #F8C8DC;
  --color-navy: #1E2761;
  --color-pink-accent: #A84D6B;
  // ... etc
}
```

Then recompile: `npx sass scss:css`

### Fonts
The site uses:
- **Playfair Display** for headings
- **Inter** for body text

Change in the `<head>` of HTML files and update SCSS variables.

---

## Features

- Intersection Observer scroll animations
- Custom calendar with Google Calendar integration
- Mailing list form with Google Sheets backend
- YouTube video lazy-loading
- Fully responsive design
- Accessible navigation
- Modern CSS (Grid, Flexbox, Custom Properties)

---

## License

© 2026 That's What She Said with Christiana Malacara
