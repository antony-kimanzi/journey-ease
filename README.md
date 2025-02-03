# JourneyEase

## Description

JourneyEase is a full-stack web application designed to simplify travel planning and management. It enables users to organize trips, book reservations, and track travel details seamlessly in one place.
This project consists of a **backend** built with Python (Flask) and a **frontend** using JavaScript (React). The project is structured into two main directories:
- `backend/`: Contains the server-side code.
- `frontend/`: Houses the client-side application.

## Project Structure
```
project_root/
│── backend/
│   ├── instance/
│   ├── migrations/
│   ├── routes/
│   ├── app.py
│   ├── models.py
│   ├── Pipfile
│   ├── Pipfile.lock
│   ├── requirements.txt
│
│── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│
│── README.md
```

## Backend Setup
### Prerequisites

- Python (>= 3.8)
- pip or pipenv

### Installation

1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies using pipenv or pip:
   ```sh
   pipenv install  # OR
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```sh
   python app.py
   ```

## Frontend Setup
### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install  # OR
   yarn install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev  # OR
   yarn dev
   ```

## Running the Project

1. Start the backend server.
2. Start the frontend server.
3. Open `http://localhost:3000` (or the specified port) in your browser.

## Features

- **Trip Planning**: Users can create, manage, and organize their travel itineraries effortlessly.
- **Booking System**: Allows users to book flights, hotels, and activities from a single platform.
- **Travel Dashboard**: Provides a centralized location to track reservations, expenses, and trip details.
- **Responsive UI**: Built with modern web technologies for a seamless experience across all devices.

## Known Issues & Bug Reports

- **Deleting Account logout Issue**: When a user deletes an account, the account is deleted successfully but it doesn't automatically logouts therefore the user needs to manually logout.

## Resources

- **Deployed Frontend**: [Journey Ease App - Frontend](https://journey-ease-website.vercel.app/)
- **Deployed Backend**: [Journey Ease App - Backend](https://journey-ease.onrender.com/)
- **Demo Presentation**: [Screencastify Video Demo](https://drive.google.com/file/d/1EN0-ZDMJRYvEWKpGkcIWQjwlvsZnRU8l/view)


## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Submit a pull request.

## License

This project is licensed under the [MIT-licence](https://github.com/antony-kimanzi/journey-ease/blob/main/LICENSE.md).

