# Employees Task Tracking Calendar

This project is a React application that displays a weekly schedule for a group of employees.

## Project info

Features:

- Employee Schedules: Displays a weekly schedule for multiple employees.
- Date Navigation: Allows users to navigate between weeks using "Previous Week" and "Next Week" buttons.
- Date Selection: Enables users to select a specific month and year.
- Task Display: Displays tasks for each employee on their respective days, including task title, start time, end time, and type (work or    meeting).
- Task Hover: Provides hover for each task to display description.

## Technologies used

This project is built with:

- React
- JavaScript
- Tailwind CSS (for styling)
- Axios (for making API requests)
- Node.js (for the server-side API)
- Express.js (for building the API server)
- MySQL (for database management)

 ## Configuration

Create a .env file in the root of the project, and replace placeholders with your actual database credentials.
Note: Do not commit the .env file to version control.

## How can to use this code?

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <REPOSITORY_URL>

# Step 2: Navigate to the project directory.
cd <PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Navigate to the api directory.
cd api

# Step 5: Start the node server.
node schedule.cjs

# Step 6: Navigate back to project directory.
cd ..

# Step 7: Start the react server.
npm run dev
``
