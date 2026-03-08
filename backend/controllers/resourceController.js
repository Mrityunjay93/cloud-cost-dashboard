const { addResource, getResources } = require("../models/resourceModel");
const { getProjectByIdForUser } = require("../models/projectModel");

exports.create = async (req, res) => {

  try {

    const {
      project_id,
      name,
      provider,
      cost_per_hour,
      usage_hours
    } = req.body || {};

    const parsedProjectId = Number(project_id);
    const parsedCost = Number(cost_per_hour);
    const parsedHours = Number(usage_hours);

    if (!parsedProjectId || !name || !provider || Number.isNaN(parsedCost) || Number.isNaN(parsedHours)) {
      return res.status(400).json({ message: "All resource fields are required" });
    }

    if (parsedCost < 0 || parsedHours < 0) {
      return res.status(400).json({ message: "Cost and usage must be non-negative" });
    }

    const project = await getProjectByIdForUser(parsedProjectId, req.user.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const resource = await addResource(
      parsedProjectId,
      name.trim(),
      provider.trim(),
      parsedCost,
      parsedHours
    );

    res.status(201).json(resource);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.list = async (req, res) => {

  try {

    const { project_id } = req.params || {};
    const parsedProjectId = Number(project_id);

    if (!parsedProjectId) {
      return res.status(400).json({ message: "Valid project id is required" });
    }

    const project = await getProjectByIdForUser(parsedProjectId, req.user.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const resources = await getResources(parsedProjectId);

    res.json(resources);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
