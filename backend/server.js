const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const url = require('url');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const parsedUrl = url.parse(process.env.DATABASE_URL);
const db = mysql.createConnection({
  host: parsedUrl.hostname,
  user: parsedUrl.auth.split(':')[0],
  password: parsedUrl.auth.split(':')[1],
  database: parsedUrl.path.split('/')[1],
  port: parsedUrl.port,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/', (req, res) => {
  res.send("Server is running!");
})
app.get('/api/flashcards', (req, res) => {
  db.query('SELECT * FROM flashcards', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/api/flashcards', (req, res) => {
  const { question, answer } = req.body;


  db.query('SELECT MAX(id) AS maxId FROM flashcards', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    
    const maxId = result[0].maxId;
    const newId = (maxId === null) ? 1 : maxId + 1; // Start with 1 if no records exist

    db.query(
      'INSERT INTO flashcards (id, question, answer) VALUES (?, ?, ?)',
      [newId, question, answer],
      (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(201).json({ id: newId, question, answer });
      }
    );
  });
});


app.put('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  db.query(
    'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?',
    [question, answer, id],
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('Flashcard updated');
    }
  );
});

app.delete('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM flashcards WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Flashcard deleted');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
