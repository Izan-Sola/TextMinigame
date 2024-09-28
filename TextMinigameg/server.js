
const mysql = require('mysql2/promise'); 
const bodyParser = require("body-parser");

const cors = require('cors');
const express = require('express'); 
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.json());
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
      
      return rows;
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

app.post('/databaseupdates', async (req, res) => {
  const { name, score, action } = req.body;
  const result = await dataBaseConnection(name, score, action);
  res.json(result); 
});

app.listen(port, '192.168.18.48', () => {
  console.log(`Server is running on http://yourIP:${port}`);
});
