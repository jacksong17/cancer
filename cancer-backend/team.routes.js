const express = require('express');
const router = express.Router();

// Team CRUD operations
router.post('/', (req, res) => {
  const { name, description } = req.body;
  req.db.run("INSERT INTO teams (name, description) VALUES (?, ?)", [name, description], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

router.get('/', (req, res) => {
  req.db.all("SELECT * FROM teams", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  req.db.get("SELECT * FROM teams WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  req.db.run("UPDATE teams SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [name, description, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    });
});

router.delete('/:id', (req, res) => {
  req.db.run("DELETE FROM teams WHERE id = ?", req.params.id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(204).send();
  });
});

// Team member management
router.post('/:id/members', (req, res) => {
  const { user_id, role } = req.body;
  req.db.run("INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)",
    [req.params.id, user_id, role],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    });
});

router.delete('/:id/members/:userId', (req, res) => {
  req.db.run("DELETE FROM project_members WHERE project_id = ? AND user_id = ?",
    [req.params.id, req.params.userId],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(204).send();
    });
});

module.exports = router;
