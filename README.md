# Linkedly

A Chrome extension for AI-assisted networking on LinkedIn. Open someone's profile and Linkedly writes a tailored outreach message with ChatGPT, finds likely email addresses through Hunter.io, and lets you build downloadable lists of connections.

**Status:** archived side project from 2023. The server and database it relied on are no longer running.

## Features

- **Outreach messages:** generates a personalized reach-out message from the profile you're viewing and your own background and goal.
- **Email lookup:** finds possible work emails for a person using their company's domain.
- **Connection lists:** saves profiles to lists you can download.
- **Accounts and billing:** Google sign-in, with paid plans through Stripe.

## Tech stack

- Chrome extension (Manifest V3) written in vanilla JavaScript, HTML, and CSS
- Node.js and Express server with MongoDB through Mongoose
- OpenAI API for message generation, Stripe for subscriptions, and Hunter.io for email lookup
- A Python script (BeautifulSoup) that scraped Fortune 500 company domains into the database

## Project structure

| Path | What's in it |
|---|---|
| `linkedlyapp/linkedlychromeext/` | The extension as it shipped: login, onboarding, main popup, lists, and settings pages |
| `linkedlyapp/linkedly-redesign/` | An unfinished redesign of the extension |
| `linkedlyapp/llServer/` | The Express API server (`index.js`) and the landing page (`landing-page/`) |
| `linkedlyapp/llServer/domains.py` | Scraper for company email domains |

## Running it

1. In Chrome, go to `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select `linkedlyapp/linkedlychromeext`.
2. The server expects a `.env` file and MongoDB, OpenAI, and Stripe credentials. These were left blank in the code, so you'd need to fill them in to run it.
