const { createProject, getProjects } = require("../models/projectModel");

exports.create = async (req, res) => {

  try {

    const { name } = req.body || {};
    const cleanedName = (name || "").trim();

    if (!cleanedName) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await createProject(cleanedName, req.user.id);

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.list = async (req, res) => {

  try {

    const projects = await getProjects(req.user.id);

    res.json(projects);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
