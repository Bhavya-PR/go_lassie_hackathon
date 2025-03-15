# GoLassie Hackathon - Payer Management System

## Project Overview
This project is a Payer Management System designed for the dental insurance industry. It helps to deduplicate payer data, provide payer details, and allow admin panel functionality for managing duplicate payers. The project uses the PERN Stack (PostgreSQL, Express, React, Node.js) along with SQLite3 as the database for this solution.

## Features
- **Payer List**: Displays a list of payers and allows searching by payer name or payer number.
- **Payer Details**: View detailed information about each payer (payer name, payer numbers, payer group).
- **Admin Panel**: Allows the admin to merge duplicate payers based on selected IDs.
- **Database**: SQLite3 database with tables for payer_groups, payers, and payer_details.
- **Admin API**: API to merge duplicate payers.
- **Responsive UI**: Built with React, TailwindCSS for styling, and Vite as the build tool.

## Project Setup

### Prerequisites
Make sure you have the following installed:
- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher

### Setup Instructions
1. **Backend Setup**:
   - Navigate to the `server/` folder:
     ```bash
     cd server
     ```
   - Install backend dependencies:
     ```bash
     npm install
     ```
   - Set up the database (initialize and create schema):
     ```bash
     node database/initDB.js
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```
   - The server will run on `http://localhost:5000`.

2. **Frontend Setup**:
   - Navigate to the `client/` folder:
     ```bash
     cd client
     ```
   - Install frontend dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm run dev
     ```
   - The frontend will run on `http://localhost:5173`.

## API Endpoints
- **GET /payers**: Get the list of all payers.
- **GET /payers/search?query=<search_string>**: Search for payers by name or payer number.
- **GET /payers/:id**: Get detailed information about a specific payer.
- **POST /admin/merge**: Merge selected payers into one (admin functionality).

## Project Structure
golassie-hackathon/
│── client/                       # Frontend (React)<br>
│   │── public/                   # Static assets
│   │── src/                      # React app source code
│   │   ├── components/           # UI components
│   │   ├── pages/                # Page components
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point (router setup)
│   │   ├── index.css             # Global styles (Tailwind)
│   │── package.json              # Frontend dependencies
│   │── vite.config.js            # Vite config
│
│── server/                       # Backend (Node.js, Express)
│   │── config/                   # Database configuration
│   │   ├── db.js                 # SQLite connection setup
│   │── routes/                   # API routes
│   │   ├── payers.js             # Payer API routes
│   │   ├── admin.js              # Admin API routes
│   │── database/                 # Database & migration scripts
│   │   ├── payerDB.sqlite        # SQLite database file
│   │   ├── schema.sql            # Database schema
│   │   ├── importPayers.js       # Import payers from Excel
│   │   ├── deduplicatePayers.js  # Deduplicate payers
│   │   ├── initDB.js             # Initialize the database
│   │── index.js                  # Express server
│   │── package.json              # Backend dependencies
│── README.md                     # Project documentation
│── .env                          # Environment variables (database path, port)
│── Payers.xlsx                   # Sample payer data file


## Tech Stack
- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express.js, SQLite3, Axios

## License
This project is licensed under the MIT License.
