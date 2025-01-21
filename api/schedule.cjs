const express = require('express');
const mysql = require('mysql2');
const cors = require("cors");

const app = express();
const port = 3001; 

app.use(cors({
  origin: 'http://localhost:3036', 
}));

const dotenv = require('dotenv');
dotenv.config();

// Database configuration
const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// Connect to the database
connection.connect((error) => {
    if (error) throw error;
    console.log('Connected to MySQL');
  });
  
  app.get('/api/schedule', (req, res) => {
    const query = `
      SELECT 
        employees.id AS employee_id,
        employees.name AS employee_name,
        tasks.id AS task_id,
        tasks.title,
        tasks.description,
        DATE_FORMAT(tasks.start_time, '%Y-%m-%d') AS task_date, 
        TIME(tasks.start_time) AS start_time,
        TIME(tasks.end_time) AS end_time
      FROM tasks
      JOIN employees ON tasks.employee_id = employees.id
      ORDER BY employees.id, task_date, start_time
    `;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching data from database:', error);
        return res.status(500).json({ error: 'Failed to fetch data from database.' });
      }
  
      const employees = {};
  
      results.forEach((row) => {
        const { 
          employee_id, 
          employee_name, 
          task_id, 
          title, 
          description, 
          task_date, 
          start_time, 
          end_time 
        } = row;
  
        const taskType = title.toLowerCase().includes('meet') ? 'meeting' : 'work';
        
  
        if (!employees[employee_id]) {
          employees[employee_id] = {
            id: employee_id,
            name: employee_name,
            tasks: {},
          };
        }
  
        if (!employees[employee_id].tasks[task_date]) {
          employees[employee_id].tasks[task_date] = [];
        }
  
        employees[employee_id].tasks[task_date].push({
          id: task_id,
          title,
          description,
          startTime: start_time,
          endTime: end_time,
          type: taskType,
        });
      });
  
      res.json(Object.values(employees)); 
    });
  });
  
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
