# The Phonebook (Full Stack Open, Part 2)

A simple phonebook application that demonstrates controlled forms, list rendering, filtering, and CRUD over a JSON server backend.

## Features

- Add people with name and number
- Prevent duplicates by name with an alert
- Case-insensitive filtering by name
- Persist data to a backend using axios
- Update an existing person's number (PUT)
- Delete a person with confirmation (DELETE)
- User notifications
  - Success and error banners that auto-hide after 5s
  - Handles stale data errors (e.g., already-deleted person)

## Run

1. Install deps: `npm install`
2. Start the mock backend: `npm run server`
   - Serves `db.json` on `http://localhost:3001`
   - Persons endpoint: `GET/POST/PUT/DELETE /persons`
3. In another terminal, start Vite: `npm run dev`

## Code Structure

- `src/App.jsx` – state, effects, and handlers
- `src/components/Filter.jsx` – search input
- `src/components/PersonForm.jsx` – add/update form
- `src/components/Persons.jsx` – list + delete buttons
- `src/components/Notification.jsx` – success/error banner
- `src/services/persons.js` – axios helpers: `getAll`, `create`, `update`, `remove`

Notes:
- Keys use backend-provided `id`s
- JSON server must be running for create/update/delete to persist
