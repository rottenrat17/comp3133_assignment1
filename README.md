# COMP3133 – Assignment 1 (Employee Management System – GraphQL Backend)

**Name:** Pratik Pokhrel  
**Student ID:** 101487514

This is a backend-only Employee Management System built with **Node.js**, **Express**, **GraphQL**, and **MongoDB Atlas**.  
You’ll test it using **GraphiQL** (browser) and **Postman**.

---

## What you need

- Node.js (v18+)
- A MongoDB Atlas connection string

---

## Run it (copy/paste)

From the project folder:

```bash
npm install
copy .env.example .env
npm run seed
npm start
```

Then open GraphiQL:

- `http://localhost:4000/graphql`

---

## Environment file (`.env`)

Open `.env` and set **`MONGODB_URI`** to your Atlas connection string.  
`PORT=4000` is fine to keep.

---

## Sample login (created by `npm run seed`)

- **Email:** `johndoe@example.com`
- **Password:** `password123`

---

## GraphQL operations (main ones)

### Login

```graphql
mutation {
  login(email: "johndoe@example.com", password: "password123") {
    message
    user_id
    jwt_token
  }
}
```

### Get all employees

```graphql
query {
  employees {
    _id
    first_name
    last_name
    email
    position
    salary
    department
  }
}
```

---

## Folder structure

```
comp3133/
├── src/
│   ├── config/db.js
│   ├── graphql/schema.js
│   ├── graphql/resolvers.js
│   ├── models/User.js
│   ├── models/Employee.js
│   ├── scripts/seed.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Submission checklist (quick)

- MongoDB Atlas screenshots showing `users` and `employees` collections
- Postman collection export (v2.1) + screenshots of requests/responses
- Zip the project **without** `node_modules`
- GitHub repo link (if private, add `pritamworld` as collaborator)
