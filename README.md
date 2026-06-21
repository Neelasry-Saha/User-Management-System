# User Management API

An Express.js backend built with a clean MVC + service-layer architecture, JWT authentication, and centralized error handling. Data is stored **in-memory** so the project runs instantly with zero external setup (no database required).

## Folder Structure

```
user-management-api/
├── src/
│   ├── config/
│   │   └── index.js          # Centralized env config
│   ├── controllers/
│   │   └── userController.js # Thin HTTP layer — calls services, shapes responses
│   ├── middlewares/
│   │   ├── asyncHandler.js   # Wraps async routes, forwards errors to next()
│   │   ├── authMiddleware.js # JWT auth (protect) + admin guard (isAdmin)
│   │   └── errorMiddleware.js# 404 handler + centralized error handler
│   ├── models/
│   │   └── userModel.js      # In-memory data store + password hashing
│   ├── routes/
│   │   ├── index.js          # Aggregates and mounts all route modules
│   │   └── userRoutes.js     # All /api/users/* endpoints
│   ├── services/
│   │   └── userService.js    # All business logic lives here
│   ├── utils/
│   │   ├── ApiError.js       # Custom error class with statusCode
│   │   ├── ApiResponse.js    # Standardized success response shape
│   │   └── generateToken.js  # JWT signing helper
│   ├── validators/
│   │   └── userValidator.js  # express-validator rule chains
│   └── app.js                # Express app: middleware, routes, error handlers
├── .env.example
├── .gitignore
├── package.json
├── server.js                 # Entry point — starts the server
└── README.md
```

**Why this structure?**
- **Controllers** only handle HTTP concerns (req/res) — no business logic.
- **Services** hold all logic and data access, so controllers stay thin and logic is reusable/testable.
- **Models** own how data is stored. Right now that's an in-memory array; swap this single file for a real Mongoose/Sequelize model later and nothing else in the project needs to change, since the service layer only depends on the model's function signatures.
- **Middlewares** are composable and centralized (auth, error handling, async wrapping).
- **app.js vs server.js** are split so the Express app can be imported and tested in isolation.

## Setup

```bash
npm install
copy .env.example .env      # Mac/Linux: cp .env.example .env
npm run dev                  # or: npm start
```

No database needed — the server starts immediately. Visit `http://localhost:3000/` to confirm it's running.

## Authentication

`POST /api/users/login` returns a JWT. Send it on protected routes as:

```
Authorization: Bearer <token>
```

- **Public**: create-user, login, verify-email, resend-verification, read-user, update-user, delete-user, all-users, user/:id, search, filter
- **Requires login (`protect`)**: logout, change-password, update-profile, upload-profile-picture, delete-account
- **Requires admin (`protect` + `isAdmin`)**: make-admin/:id, remove-admin/:id, block-user/:id, unblock-user/:id

## Routes

All routes are mounted under `/api/users`.

| Method | Endpoint                  | Auth        | Description                    |
|--------|----------------------------|-------------|---------------------------------|
| POST   | /create-user               | Public      | User created successfully       |
| GET    | /read-user                 | Public      | User read successfully          |
| PUT    | /update-user                | Public      | User updated successfully       |
| DELETE | /delete-user                | Public      | User deleted successfully       |
| GET    | /all-users                  | Public      | All users fetched successfully  |
| GET    | /user/:id                   | Public      | User fetched by ID              |
| POST   | /login                      | Public      | User login successful           |
| POST   | /logout                     | Protected   | User logout successful          |
| PUT    | /change-password            | Protected   | Password changed successfully   |
| PUT    | /update-profile              | Protected   | User profile updated successfully |
| POST   | /upload-profile-picture     | Protected   | Profile picture uploaded successfully |
| DELETE | /delete-account              | Protected   | Account deleted successfully    |
| PUT    | /make-admin/:id              | Admin       | User made admin successfully    |
| PUT    | /remove-admin/:id            | Admin       | Admin role removed successfully |
| PATCH  | /block-user/:id               | Admin       | User blocked successfully       |
| PATCH  | /unblock-user/:id             | Admin       | User unblocked successfully     |
| GET    | /search?q=                  | Public      | User search completed successfully |
| GET    | /filter?role=&isBlocked=    | Public      | User filter completed successfully |
| POST   | /verify-email                | Public      | Email verified successfully     |
| POST   | /resend-verification         | Public      | Verification email resent       |

A health check is also available at `GET /`.

## Try it (example flow)

```bash
# 1. Create a user
curl -X POST http://localhost:3000/api/users/create-user \
  -H "Content-Type: application/json" \
  -d '{"name":"Opu","email":"opu@example.com","password":"secret123"}'

# 2. Log in to get a token
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"opu@example.com","password":"secret123"}'

# 3. Use the token on a protected route
curl -X PUT http://localhost:3000/api/users/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"name":"Opu Rahman"}'
```

## Notes

- Data resets every time the server restarts (it's all in memory) — this is expected and fine for demonstrating the structure.
- `create-user` requires `name`, `email`, and `password` (a real signup needs a password to enable login).
- Validation is enforced via `express-validator` on create-user, login, and change-password.
- To persist data permanently, replace `src/models/userModel.js` with a real database model — the rest of the app (controllers, services, routes) won't need to change.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: User management API with MVC structure"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Make sure the repository is set to **Public**, then submit the repo URL as your assignment link.
