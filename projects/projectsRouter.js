const express = require("express");
const router = express.Router();

const projectsdb = require("../data/helpers/projectModel");

router.get("/", (req, res) => {
  projectsdb
    .get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ error: "The project could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  projectsdb
    .get(req.params.id)
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ error: "The project could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  if (req.body.name.length < 129) {
    projectsdb
      .insert(req.body)
      .then(projects => {
        res.status(200).json(projects);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Project could not be posted.", eror: err });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, completed } = req.body;
  projectsdb
    .update(id, { name, description, completed })
    .then(updated => {
      if (!updated) {
        res.status(400).json({
          error: `The project post with Id ${id} could not be updated.`
        });
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: `There was a problem saving project post ${id}` });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  projectsdb
    .remove(id)
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res
        .status(500)
        .json({
          message: `The project with specified Id ${id} could not be deleted`
        });
    });
});

module.exports = router;
