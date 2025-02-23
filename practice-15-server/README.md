# Clearify - Task Management Application (Server-Side)

The server-side of Clearify is built with **Express.js** and connects to a **MongoDB** database. It provides secure API endpoints for managing tasks (CRUD operations) and ensures real-time syncing using MongoDB Change Streams or WebSockets. User-specific data is protected using Firebase Authentication tokens.

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB 
- **Authentication**: Firebase Authentication (JWT validation)
- **Real-Time Syncing**: MongoDB Change Streams or WebSockets
- **Environment Variables**: Dotenv


## Dependencies

- `cors`: ^2.x
- `express`: ^4.x
- `dotenv`: ^16.x
- `jsonwebtoken`: ^8.x
- `firebase-admin`: ^11.x
- `ws` : ^8.x (for WebSocket implementation)


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zahid-official/practice-15-server

2. 
   ```bash
   npm install

3. 
   ```bash
   node index.js
   
## Live Links

- **Github Repo**: [Repository](https://github.com/zahid-official/practice-15-server)



## Thank You

Thank you for exploring the backend of Clearify! If you encounter any issues or have ideas for improvement, please open an issue or submit a pull request. Your contributions are always welcome! 🚀