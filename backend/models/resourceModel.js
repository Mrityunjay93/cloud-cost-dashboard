const pool = require("../config/db");

const addResource = async (
  project_id,
  name,
  provider,
  cost_per_hour,
  usage_hours
) => {

  const total_cost = cost_per_hour * usage_hours;

  const result = await pool.query(
    "INSERT INTO resources(project_id,name,provider,cost_per_hour,usage_hours,total_cost) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
    [project_id, name, provider, cost_per_hour, usage_hours, total_cost]
  );

  return result.rows[0];
};

const getResources = async (project_id) => {
  const result = await pool.query(
    "SELECT * FROM resources WHERE project_id=$1 ORDER BY id DESC",
    [project_id]
  );

  return result.rows;
};

module.exports = {
  addResource,
  getResources,
};
