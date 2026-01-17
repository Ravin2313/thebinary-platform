# API Documentation - Project Shop

Base URL: `http://localhost:5000/api`

## Public APIs (No Authentication Required)

### 1. Get All Projects

**Endpoint:** `GET /api/projects`

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title and description

**Example:**
```
GET /api/projects?category=College Project&search=website
```

**Response:**
```json
[
  {
    "_id": "project_id",
    "title": "E-Commerce Website",
    "category": "Web Application",
    "description": "Complete online shopping platform",
    "features": ["User login", "Shopping cart", "Payment"],
    "technologies": ["HTML", "CSS", "JavaScript", "Node.js"],
    "price": 5000,
    "images": ["/uploads/image1.jpg"],
    "demoLink": "https://demo.com",
    "reviews": [],
    "status": "Available",
    "createdAt": "2026-01-04T00:00:00.000Z"
  }
]
```

### 2. Get Single Project

**Endpoint:** `GET /api/projects/:id`

**Example:**
```
GET /api/projects/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "E-Commerce Website",
  "category": "Web Application",
  "description": "Complete online shopping platform",
  "features": ["User login", "Shopping cart", "Payment"],
  "technologies": ["HTML", "CSS", "JavaScript", "Node.js"],
  "price": 5000,
  "images": ["/uploads/image1.jpg"],
  "demoLink": "https://demo.com",
  "reviews": [
    {
      "studentName": "Rahul Kumar",
      "rating": 5,
      "comment": "Excellent project!",
      "date": "2026-01-03T00:00:00.000Z"
    }
  ],
  "status": "Available",
  "createdAt": "2026-01-04T00:00:00.000Z"
}
```

### 3. Add Review to Project

**Endpoint:** `POST /api/projects/:id/review`

**Request Body:**
```json
{
  "studentName": "Priya Sharma",
  "rating": 5,
  "comment": "Great project, helped me a lot!"
}
```

**Response:**
```json
{
  "_id": "project_id",
  "title": "E-Commerce Website",
  "reviews": [
    {
      "studentName": "Priya Sharma",
      "rating": 5,
      "comment": "Great project, helped me a lot!",
      "date": "2026-01-04T00:00:00.000Z"
    }
  ]
}
```

### 4. Submit Contact Form

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "Amit Singh",
  "email": "amit@example.com",
  "phone": "+919876543210",
  "projectId": "507f1f77bcf86cd799439011",
  "projectTitle": "E-Commerce Website",
  "message": "I want to buy this project"
}
```

**Response:**
```json
{
  "message": "Contact request submitted successfully!",
  "contact": {
    "_id": "contact_id",
    "name": "Amit Singh",
    "email": "amit@example.com",
    "phone": "+919876543210",
    "projectId": "507f1f77bcf86cd799439011",
    "projectTitle": "E-Commerce Website",
    "message": "I want to buy this project",
    "status": "New",
    "createdAt": "2026-01-04T00:00:00.000Z"
  }
}
```

## Admin APIs (Authentication Required)

**Authentication:** Include JWT token in header
```
Authorization: Bearer <token>
```

### 5. Admin Login

**Endpoint:** `POST /api/admin/login`

**Request Body:**
```json
{
  "email": "admin@projectshop.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### 6. Get All Projects (Admin)

**Endpoint:** `GET /api/admin/projects`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Same as public projects API but includes all projects

### 7. Create Project

**Endpoint:** `POST /api/admin/projects`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): Project title
- `category` (required): Project category
- `description` (required): Project description
- `features` (required): JSON array of features
- `technologies` (required): JSON array of technologies
- `price` (required): Project price
- `status` (optional): Available/Sold/Custom Order
- `demoLink` (optional): Demo URL
- `images` (optional): Multiple image files

**Example:**
```javascript
const formData = new FormData();
formData.append('title', 'E-Commerce Website');
formData.append('category', 'Web Application');
formData.append('description', 'Complete shopping platform');
formData.append('features', JSON.stringify(['Login', 'Cart', 'Payment']));
formData.append('technologies', JSON.stringify(['HTML', 'CSS', 'Node.js']));
formData.append('price', 5000);
formData.append('images', file1);
formData.append('images', file2);
```

**Response:**
```json
{
  "_id": "new_project_id",
  "title": "E-Commerce Website",
  "category": "Web Application",
  "description": "Complete shopping platform",
  "features": ["Login", "Cart", "Payment"],
  "technologies": ["HTML", "CSS", "Node.js"],
  "price": 5000,
  "images": ["/uploads/1234567890.jpg"],
  "status": "Available",
  "createdAt": "2026-01-04T00:00:00.000Z"
}
```

### 8. Update Project

**Endpoint:** `PUT /api/admin/projects/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:** Same as Create Project

**Response:** Updated project object

### 9. Delete Project

**Endpoint:** `DELETE /api/admin/projects/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

### 10. Get All Contacts

**Endpoint:** `GET /api/admin/contacts`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "contact_id",
    "name": "Amit Singh",
    "email": "amit@example.com",
    "phone": "+919876543210",
    "projectId": "507f1f77bcf86cd799439011",
    "projectTitle": "E-Commerce Website",
    "message": "I want to buy this project",
    "status": "New",
    "createdAt": "2026-01-04T00:00:00.000Z"
  }
]
```

### 11. Update Contact Status

**Endpoint:** `PUT /api/admin/contacts/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Response:** Updated contact object

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting implemented. Consider adding in production.

## CORS

CORS is enabled for all origins in development. Configure for specific domains in production.

## File Upload Limits

- Maximum 5 images per project
- Supported formats: jpg, jpeg, png, gif
- Maximum file size: 5MB per image (configurable in multer settings)

---

**Note:** Replace `localhost:5000` with your actual domain in production.
