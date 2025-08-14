# ERP System - Unit Management

A comprehensive ERP system with Unit CRUD operations built with React frontend and Node.js backend, featuring the Metronica admin template design.

## Features

### Unit Management
- ✅ Create new units with name, description, and status
- ✅ Update existing units
- ✅ Delete units with confirmation
- ✅ List all units with pagination
- ✅ Search units by name
- ✅ Modern UI with Metronica admin template styling
- ✅ Responsive design for mobile devices

### Authentication
- ✅ User registration with password validation
- ✅ User login with JWT token
- ✅ Protected routes with authentication middleware
- ✅ Secure password hashing with bcrypt

### Navigation
- ✅ Modern navigation bar with active state indicators
- ✅ Easy navigation between Branches and Units
- ✅ Logout functionality

## API Endpoints

### Unit Management
- `POST /api/unit/store` - Create or update unit
- `DELETE /api/unit/delete/:id` - Delete unit
- `POST /api/unit/list` - Get units with pagination and search
- `GET /api/unit/:id` - Get single unit

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Branches
- `GET /api/branches` - Get all branches
- `POST /api/branches` - Create new branch

## Installation

### Backend Setup
```bash
cd erp/backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:
```bash
npm start
```

### Frontend Setup
```bash
cd erp/frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

## Usage

1. **Register/Login**: Start by creating an account or logging in
2. **Navigate**: Use the navigation bar to switch between Branches and Units
3. **Manage Units**: 
   - Click "Add New Unit" to create units
   - Use the search functionality to find specific units
   - Edit or delete units using the action buttons
   - Navigate through pages using pagination

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Font Awesome** - Icons
- **CSS3** - Styling with modern design

## Project Structure

```
erp/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Unit.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── branch.js
│   │   └── unit.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Branches.js
│   │   ├── Units.js
│   │   ├── Navigation.js
│   │   └── *.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## API Examples

### Create/Update Unit
```bash
POST /api/unit/store
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "6897a1f6aaa4324b9f2f1d64",  // Optional for update
  "name": "Test Unit",
  "description": "Unit description",
  "isActive": true
}
```

### Delete Unit
```bash
DELETE /api/unit/delete/6897a1f6aaa4324b9f2f1d64
Authorization: Bearer <token>
```

### List Units
```bash
POST /api/unit/list
Authorization: Bearer <token>
Content-Type: application/json

{
  "search": "test",
  "page": 1,
  "limit": 10,
  "sortBy": "createdAt",
  "sortOrder": "desc"
}
```

## Design Features

- **Modern UI**: Clean and professional design inspired by Metronica admin template
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **User Experience**: Intuitive navigation and smooth interactions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Proper error messages and validation
- **Accessibility**: Semantic HTML and keyboard navigation support

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Protected Routes**: Authentication middleware for sensitive endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 