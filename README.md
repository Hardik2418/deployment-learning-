# Field Notes

A basic multi-route Node.js web project using Express, EJS, and MongoDB.

## Run it

```bash
npm install
copy .env.example .env
npm run dev
```

Open http://localhost:3000.

MongoDB is optional for the first run. Without `MONGODB_URI`, the app uses sample messages and still serves every page. With MongoDB running, set `MONGODB_URI` in `.env` and submitted messages are saved to the `messages` collection.

## Routes

- `GET /` - home page
- `GET /about` - project overview
- `GET /messages` - message list and form
- `GET /api/health` - server/database status
- `GET /api/messages` - message JSON
- `POST /messages` - create a message

## Reverse-engineered check

The browser flow is: page request -> Express route -> EJS template -> HTML response. The data flow is: message form -> `POST /messages` -> validation -> Mongoose `Message` model -> MongoDB -> redirect to `/messages`. The API health response exposes whether the database connection is active, which makes deployment troubleshooting direct.
