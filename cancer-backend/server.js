const express = require('express');
const bodyParser = require('body-parser');
const iconv = require('iconv-lite');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDatabase();
  }
});

function initDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    owner TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    progress INTEGER NOT NULL,
    parent_pillar TEXT,
    priority INTEGER,
    budget DECIMAL,
    department TEXT,
    manager TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating projects table:', err.message);
    } else {
      console.log('Projects table initialized successfully.');
    }
  });
}

app.post('/api/projects', (req, res) => {
  const { name, description, status, owner, start_date, end_date, progress, parent_pillar, priority, budget, department, manager } = req.body;
  
  if (!name || !status || !owner || !start_date || progress === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `INSERT INTO projects (name, description, status, owner, start_date, end_date, progress, parent_pillar, priority, budget, department, manager)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, description, status, owner, start_date, end_date, progress, parent_pillar, priority, budget, department, manager];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error creating project:', err.message);
      res.status(500).json({ error: 'Failed to create project', details: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, message: 'Project created successfully' });
  });
});

app.get('/api/projects', (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) {
      console.error('Error fetching projects:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/projects/:id', (req, res) => {
  db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching project:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(row);
  });
});

app.put('/api/projects/:id', (req, res) => {
  const { name, description, status, owner, start_date, end_date, progress, parent_pillar, priority, budget, department, manager } = req.body;
  db.run(`UPDATE projects SET 
          name = ?, description = ?, status = ?, owner = ?, start_date = ?, end_date = ?, 
          progress = ?, parent_pillar = ?, priority = ?, budget = ?, department = ?, manager = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [name, description, status, owner, start_date, end_date, progress, parent_pillar, priority, budget, department, manager, req.params.id],
    function(err) {
      if (err) {
        console.error('Error updating project:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes, message: 'Project updated successfully' });
    });
});

app.delete('/api/projects/:id', (req, res) => {
  db.run("DELETE FROM projects WHERE id = ?", req.params.id, function(err) {
    if (err) {
      console.error('Error deleting project:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Project deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});