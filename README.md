# Namaste Frontend (React + Redux + Tailwind CSS)

Namaste frontend is a React chat application built with Redux for state management and Tailwind CSS for styling. It serves as the user interface for the Namaste application, providing a seamless and interactive experience for users.

> **Note:** Here is the [backend repository](https://github.com/eshant52/namaste-backend) for setting up the backend application.

## Features

- User authentication and authorization
- Real-time chat functionality using WebSockets
- CRUD operations for user profiles, requesting other users, and notifications
- Integration with RESTful APIs for backend communication
- Responsive design for various screen sizes
- Error handling and input validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- **Namaste backend application** (refer to the [backend README](https://github.com/eshant52/namaste-backend) for setup instructions)

### Installation

1. **Clone the repository**: Clone the Namaste frontend repository from GitHub to your local machine.

   ```bash
   git clone https://github.com/eshant52/namaste.git
   ```

2. **Install dependencies**: Navigate to the project directory and install the required dependencies using npm.

   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment variables**: Create a `.env` file in the root directory of the project and add the necessary environment variables. You can use the provided `.env.example` file as a reference.

   ```bash
   cp .env.example .env
   ```

4. **Running the Application**

   ```bash
   npm run dev
   ```
