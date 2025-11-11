const mysql = require('mysql2/promise');
const bodyParser = require("body-parser");
const cors = require('cors');
const express = require('express'); 
const app = express();
const port = 3002;
const { Random } = require('random-js');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 
app.use(express.json());

// Request limits
const requestLimits = {}; 
const generalRequestLimit = 40; 
const newPlayerRequestLimit = 3; 
const timeWindow = 1 * 60 * 500; 
const newPlayerCooldown = 60 * 1000; 

const blockedIPs = ['88.228.67.42', '51.158.117.189'];

app.use(async (req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ip = clientIP.split(',')[0].trim();

  if (blockedIPs.includes(ip)) {
    console.log("Blocked IP:", ip); 
    return res.status(403).send('Access Denied');
  }

  if (!requestLimits[ip]) {
    requestLimits[ip] = {
      generalRequests: [],
      newPlayerRequests: []
    };
  }

  const { action } = req.body;
  const currentTime = Date.now();

  if (action === "newPlayer") {
    requestLimits[ip].newPlayerRequests = requestLimits[ip].newPlayerRequests.filter(
      timestamp => timestamp > currentTime - newPlayerCooldown
    );

    if (requestLimits[ip].newPlayerRequests.length >= newPlayerRequestLimit) {
      console.log(`IP ${ip} has exceeded the newPlayer request limit.`);
      blockedIPs.push(ip);
      return res.status(429).send('Access Denied');
    }

    requestLimits[ip].newPlayerRequests.push(currentTime);
  } else {
    requestLimits[ip].generalRequests = requestLimits[ip].generalRequests.filter(
      timestamp => timestamp > currentTime - timeWindow
    );

    if (requestLimits[ip].generalRequests.length >= generalRequestLimit) {
      console.log(`Blocked IP ${ip} for exceeding general request limit.`);
      return res.status(429).send('Blocked');
    }

    requestLimits[ip].generalRequests.push(currentTime);
  }

  next();
});

async function dataBaseConnection(score, coins, action, name, password) {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "textminigame"
  });

  try {
    const number = action[action.length - 1];

    if (action.includes("updateScoreList")) {
      const [rows] = await con.query(`SELECT pname, score${number}, coins FROM players`);
      const [pwRows] = await con.query('SELECT pname FROM players WHERE password = ?', [password]);
      return { scores: rows, playerName: pwRows.length > 0 ? pwRows[0].pname : null };
    }

    else if (action.includes("newMaxScore")) {
      const number = action[action.length - 1];
      const scoreCol = `score${number}`;
      const [playerRows] = await con.query('SELECT * FROM players WHERE pname = ? AND password = ?', [name, password]);
      if (playerRows.length === 0) return { error: 'Invalid name or password.' };

      const currentMaxScore = playerRows[0][scoreCol] || 0;
      if (score > currentMaxScore) {
        const sql = `UPDATE players SET ${scoreCol} = ?, coins = ? WHERE pname = ?`;
        await con.query(sql, [score, coins, name]);
        return { message: 'New high score recorded!' };
      } else {
        return { message: 'Score was lower than or equal to current high score.' };
      }
    }

    else if (action === "newPlayer") {
      const [nameExists] = await con.query('SELECT * FROM players WHERE pname = ?', [name]);
      if (nameExists.length > 0) return { error: 'This name is already taken.' };
      await con.query("INSERT INTO players (pname, password) VALUES (?, ?)", [name, password]);
      return { message: 'New player created successfully.' };
    }

    else if (action === "login") {
      const [player] = await con.query('SELECT * FROM players WHERE pname = ? AND password = ?', [name, password]);
      if (player.length === 0) return { error: 'Wrong name or password.' };
      return { message: 'Login successful.' };
    }

  } catch (err) {
    console.error('Database operation error:', err);
    return { error: err.message };
  } finally {
    await con.end();
  }
}


app.post('/databaseupdates', async (req, res) => {
  const { score, coins, action, name, password } = req.body;
  const result = await dataBaseConnection(score, coins, action, name, password);
  res.json(result);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://yourIP:${port}`);
});
