const express = require("express");
const router = express.Router();

const projectsdb = require("../projects/projectsRouter.js");

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

router.post("/", (req, res) => {
  if (req.body.name.length < 129) {
    projectsdb
      .insert(req.body)
      .then(projects => {
        res.status(200).json(projects);
      })
      .catch(err => {
        res.status(500).json({ message: "Project could not be posted." });
      });
  }
});

module.exports = router;
