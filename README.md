# Next Question

A full-stack online Q&A (question-and-answer) web application allowing users to ask questions, provide answers, and interact with the community through voting and commenting systems.

## 🚀 Features

### Core Functionality
- **Question Management**: Ask, view, and search questions
- **Answer System**: Provide answers to questions with voting capabilities
- **Comment System**: Add comments to answers
- **Tag System**: Categorize questions with tags
- **User Authentication**: Registration, login, and profile management
- **Search Functionality**: Search questions by keywords and tags
- **Voting System**: Upvote/downvote answers
- **User Profiles**: Manage user information, bio, and website

### Advanced Features
- **Role-based Access**: Different user roles (admin, regular user)
- **Real-time Updates**: Dynamic content updates
- **Responsive Design**: Mobile-friendly interface
- **API Documentation**: Swagger/OpenAPI documentation
- **Rate Limiting**: API request limiting for security
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Centralized error management

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Axios** for API communication
- **React Context** for state management

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-rate-limit** for rate limiting
- **Swagger UI** for API documentation

### Testing
- **Jest** for unit testing
- **Cypress** for end-to-end testing
- **BDD (Behavior Driven Development)** with Cucumber

## 📁 Project Structure

```
fake-stack-overflow/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── cypress/            # E2E testing
│   └── public/             # Static assets
├── server/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models and schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── tests/             # Unit tests
│   └── openapi.yaml       # API documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fake-stack-overflow
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://127.0.0.1:27017/fake_so
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Then populate the database with sample data
   cd server
   npm run populate_db mongodb://127.0.0.1:27017/fake_so
   ```

5. **Start the Application**
   ```bash
   # Terminal 1: Start the backend server
   cd server
   npm start
   
   # Terminal 2: Start the frontend client
   cd client
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api-docs

## 🔧 Available Scripts

### Server Scripts
```bash
npm start          # Start the server
npm run dev        # Start server in development mode
npm test           # Run unit tests
npm run populate_db # Populate database with sample data
npm run remove_db   # Remove/reset database
```

### Client Scripts
```bash
npm start          # Start the React development server
npm run build      # Build for production
npm test           # Run tests
npm run cypress    # Run E2E tests
```

## 🧪 Testing

### Unit Tests
```bash
# Run server unit tests
cd server
npm test

# Run client unit tests
cd client
npm test
```

### End-to-End Tests
```bash
# Run Cypress E2E tests
cd client
npm run cypress:run

# Open Cypress test runner
npm run cypress:open
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Questions
- `GET /question` - Get all questions
- `POST /question` - Create new question
- `GET /question/:id` - Get specific question
- `PUT /question/:id` - Update question

### Answers
- `POST /answer` - Create new answer
- `PUT /answer/:id/vote` - Vote on answer
- `POST /answer/:id/addComment` - Add comment to answer

### Tags
- `GET /tag` - Get all tags with question counts

### Users
- `GET /user/profile` - Get user profile
- `PUT /user/updateProfile` - Update user profile

For complete API documentation, visit `/api-docs` when the server is running.

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with the following features:
- User registration and login
- Role-based access control
- Protected routes for authenticated users
- Session management with HTTP-only cookies




## 🙏 Acknowledgments

- Inspired by Stack Overflow's design and functionality
- Built with modern web development best practices
- Comprehensive testing coverage with Cypress and Jest



**Happy coding! 🚀**