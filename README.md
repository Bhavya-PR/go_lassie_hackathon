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
golassie-hackathon/<br>
│── client/                       # Frontend (React)<br>
│   │── public/                   # Static assets<br>
│   │── src/                      # React app source code<br>
│   │   ├── components/           # UI components<br>
│   │   ├── pages/                # Page components<br>
│   │   ├── App.jsx               # Main app component<br>
│   │   ├── main.jsx              # React entry point (router setup)<br>
│   │   ├── index.css             # Global styles (Tailwind)<br>
│   │── package.json              # Frontend dependencies<br>
│   │── vite.config.js            # Vite config<br>
│<br>
│── server/                       # Backend (Node.js, Express)<br>
│   │── config/                   # Database configuration<br>
│   │   ├── db.js                 # SQLite connection setup<br>
│   │── routes/                   # API routes<br>
│   │   ├── payers.js             # Payer API routes<br>
│   │   ├── admin.js              # Admin API routes<br>
│   │── database/                 # Database & migration scripts<br>
│   │   ├── payerDB.sqlite        # SQLite database file<br>
│   │   ├── schema.sql            # Database schema<br>
│   │   ├── importPayers.js       # Import payers from Excel<br>
│   │   ├── deduplicatePayers.js  # Deduplicate payers<br>
│   │   ├── initDB.js             # Initialize the database<br>
│   │── index.js                  # Express server<br>
│   │── package.json              # Backend dependencies<br>
│── README.md                     # Project documentation<br>
│── .env                          # Environment variables (database path, port)<br>
│── Payers.xlsx                   # Sample payer data file<br>


## Tech Stack
- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express.js, SQLite3, Axios

## License
This project is licensed under the MIT License.
