const mysql = require('mysql2/promise');
const bodyParser = require("body-parser");
const cors = require('cors');
const express = require('express'); 
const app = express();
const port = 3000;

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
  console.log('Incoming IP:', ip);

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

async function dataBaseConnection(score, coins, action, name, clientIP) {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "textminigame"
  });

  try {
    if (action === "updateScoreList") {
      const [rows] = await con.query('SELECT pname, score FROM players'); 
        const [ipRows] = await con.query('SELECT pname FROM players WHERE ip = ?', [clientIP]);
     return { scores: rows, playerName: ipRows.length > 0 ? ipRows[0].pname : null };
    } else if (action === "updateScoreList2") {
      const [rows] = await con.query('SELECT pname, score2, coins FROM players'); 
        const [ipRows] = await con.query('SELECT pname FROM players WHERE ip = ?', [clientIP]);
     return { scores: rows, playerName: ipRows.length > 0 ? ipRows[0].pname : null };
    } else if (action === "newPlayer") {
      const [existingPlayers] = await con.query('SELECT * FROM players WHERE ip = ?', [clientIP]); 
      if (existingPlayers.length > 1) {
       return { error: 'A user with this IP address already exists.' };
        
      }
      const sql = "INSERT INTO players SET pname = ?, ip = ?";
      await con.query(sql, [name, clientIP]);
      return { message: 'New player inserted successfully' };
    } else if (action === "newMaxScore") {
      const sql = "UPDATE players SET score = ? WHERE ip = ?";
      await con.query(sql, [score, clientIP]);
      return { message: 'Score updated successfully' };
    } else if (action == "newMaxScore2") {
      const sql = "UPDATE players SET score2 = ?, coins = ? WHERE ip = ?";
      await con.query(sql, [score, coins, clientIP]);
    }
  } catch (err) {
    console.error('Database operation error:', err);
    return { error: err.message };
  } finally {
    await con.end();
  }
}

app.post('/databaseupdates', async (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Use the correct method to get client IP
  const {score, coins, action, name} = req.body;
  const result = await dataBaseConnection(score, coins, action, name, clientIP);
  res.json(result);
});

app.listen(port, 'IP HERE', () => {
  console.log(`Server is running on http://yourIP:${port}`);
});
