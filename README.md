# Backend API Project (DecodeLabs Internship)

## Endpoints

- GET /users → List all users
- POST /users → Create new user
- PUT /users/:id → Update user
- DELETE /users/:id → Remove user
- POST /login → Get JWT token
- GET /profile → Protected route (requires JWT)

## Status Codes

- 200 OK → Success
- 201 Created → Resource created
- 204 No Content → Deleted successfully
- 400 Bad Request → Invalid input
- 401 Unauthorized → No token
- 403 Forbidden → Invalid token
- 404 Not Found → Resource missing
- 500 Internal Server Error → Server issue
