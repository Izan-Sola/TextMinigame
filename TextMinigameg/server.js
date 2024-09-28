// server.js
const mysql = require('mysql2/promise'); 
const bodyParser = require("body-parser");
 // This will work in Node.js
const cors = require('cors');
const express = require('express'); // Express to handle HTTP requests
const app = express();
const port = 3000; // Any port you prefer
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder
app.use(express.json()); // Middleware to parse JSON requests
// Function to handle database connection and operations
async function dataBaseConnection(name, score, action) {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "textminigame"
  });

  try {
    if (action === "updateScoreList") {
      const [rows] = await con.query('SELECT pname, score FROM players');
      
      return rows; // Return the rows to the client
    } else if (action === "newPlayer") {
      const sql = "INSERT INTO players SET pname = '" + name + "', score = " + score;
      await con.query(sql);
      return { message: 'New player inserted successfully' };
    } else if (action === "newMaxScore") {
      const sql = "UPDATE players SET score = " + score + " WHERE pname = '" + name + "'";
      await con.query(sql);
      return { message: 'Score updated successfully' };
    }
  } catch (err) {
    console.error('Database operation error:', err);
    return { error: err.message };
  } finally {
    await con.end();
  }
}

// Define an API endpoint to handle requests
app.post('/databaseupdates', async (req, res) => {
  const { name, score, action } = req.body; // Get parameters from the request body
  const result = await dataBaseConnection(name, score, action); // Pass action to manage it
  res.json(result); // Send the response back as JSON
});

// Start the server
app.listen(port, '192.168.18.48', () => {
  console.log(`Server is running on http://yourIP:${port}`);
});
