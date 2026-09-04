const express = require("express");
const db = require("../database");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    "SELECT id, titulo, done FROM tasks WHERE user_id = ?",
    [userId],
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching tasks" });
      }

      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        titulo: task.titulo,
        done: task.done === 1,
      }));

      res.json(formattedTasks);
    },
  );
});

router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { titulo, done } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: "Titulo is required" });
  }

  const doneValue = done === true ? 1 : 0;

  db.run(
    "INSERT INTO tasks (user_id, titulo, done) VALUES (?, ?, ?)",
    [userId, titulo, doneValue],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error creating task" });
      }

      res.status(201).json({
        id: this.lastID,
        titulo,
        done: done === true,
      });
    },
  );
});

router.put("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { titulo, done } = req.body;

  if (titulo === undefined && done === undefined) {
    return res
      .status(400)
      .json({ error: "At least one field (titulo or done) must be provided" });
  }

  let updateFields = [];
  let values = [];

  if (titulo !== undefined) {
    updateFields.push("titulo = ?");
    values.push(titulo);
  }

  if (done !== undefined) {
    updateFields.push("done = ?");
    values.push(done === true ? 1 : 0);
  }

  values.push(taskId, userId);

  const query = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ? AND user_id = ?`;

  db.run(query, values, function (err) {
    if (err) {
      return res.status(500).json({ error: "Error updating task" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    db.get(
      "SELECT id, titulo, done FROM tasks WHERE id = ? AND user_id = ?",
      [taskId, userId],
      (err, task) => {
        if (err) {
          return res.status(500).json({ error: "Error fetching updated task" });
        }

        res.json({
          id: task.id,
          titulo: task.titulo,
          done: task.done === 1,
        });
      },
    );
  });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  db.run(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error deleting task" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.sendStatus(204);
    },
  );
});

module.exports = router;
