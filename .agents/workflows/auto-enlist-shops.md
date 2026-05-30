---
description: auto-enlist-shops.md
---

# Auto Enlist Shops

Automatically collect and refresh barbershop data for Kolkata.

## Goal
Keep the shop list updated in the project with fresh records.

## Instructions
- Search for Kolkata barbershops from trusted public sources.
- Extract fields:
  - name
  - address
  - area
  - city
  - state
  - phone
  - website
  - rating
  - reviews
  - source_url
  - last_updated
- Save the results into a structured file in the project, preferably:
  - `src/data/barbershops.json`
  - or `src/data/barbershops.csv`
- If the file already exists, update existing records instead of duplicating them.
- Sort by rating or relevance if available.
- Validate the output so every record has at least:
  - name
  - address
  - city
- If data is missing, leave the field blank rather than guessing.
- Log what changed in the update.

## Rules
- Use only publicly available data.
- Do not invent phone numbers, ratings, or addresses.
- Keep the output deterministic and clean.
- If a website blocks scraping, use another source.

## Expected result
After running, the project should have an updated data file that the app can read directly.