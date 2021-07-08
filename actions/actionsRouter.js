const express = require("express");
const router = express.Router();

const actiondb = require("../data/helpers/actionModel.js");

// Action Routes
router.get("/", (req, res) => {
  actiondb
    .get()
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      res.status(500).json({ message: "The action could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  actiondb
    .get(id)
    .then(action => {
      if (!action) {
        res.status(404).json({
          message: `There is no action with that specified Id ${id}.`
        });
      } else {
        res.status(200).json(action);
      }
    })
    .catch(action => {
      if (action) {
        res.status(404).json({ error: `There is no action with the Id ${id}` });
      } else {
        res
          .status(500)
          .json({ error: `Could not retrieve action with specified Id ${id}` });
      }
    });
});

router.post("/", (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  if (!project_id) {
    res.status(400).json({ error: "Please provide Project ID" });
  } else if (!description.substr(1, 128)) {
    res.status(400).json({
      error: "Please provide a description no longer than 128 characters."
    });
  } else if (!notes) {
    res.status(400).json({ error: "Please provide notes" });
  } else {
    actiondb
      .insert({ project_id, description, notes, completed })
      .then(newAction => {
        res.status(200).json(newAction);
      })
      .catch(err => {
        res.status(500).json({ error: "Could not add action", error: err });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { project_id, description, notes, completed } = req.body;
  actiondb
    .update(id, { project_id, description, notes, completed })
    .then(updated => {
      res.status(200).json(updated);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `Action could not be updated at Id ${id}` });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  actiondb
    .remove(id)
    .then(count => {
      if (count) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: `Id ${id} could not be found` });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `Could not delete action with the specified id ${id}` });
    });
});

module.exports = router;
