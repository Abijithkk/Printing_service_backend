# QNL Backend

This repository contains the backend for the QNL project, built with Node.js and Express.

## Structure

- `src/` – application source code
- `config/` – configuration and environment setup
- `controllers/` – request handlers
- `middlewares/` – Express middleware functions
- `models/` – Mongoose models
- `routes/` – API routing definitions
- `utils/` – helper functions
- `validators/` – request validators
- `uploads/` – file storage directories
- `scripts/seed.js` – database seeding script

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with necessary environment variables (see `.env.example`).
3. Run the development server:
   ```bash
   npm run dev
   ```

## Notes

- Uses MongoDB for data persistence.
- Includes Cloudinary for media uploads.
- API endpoints are documented in `docs/postman_collection.json`.

## License

MIT
