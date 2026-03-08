const pool = require("../config/db");

const createProject = async (name, user_id) => {
  const result = await pool.query(
    "INSERT INTO projects(name,user_id) VALUES($1,$2) RETURNING *",
    [name, user_id]
  );
  return result.rows[0];
};

const getProjects = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM projects WHERE user_id=$1 ORDER BY id DESC",
    [user_id]
  );
  return result.rows;
};

const getProjectByIdForUser = async (project_id, user_id) => {
  const result = await pool.query(
    "SELECT * FROM projects WHERE id=$1 AND user_id=$2",
    [project_id, user_id]
  );

  return result.rows[0];
};

module.exports = {
  createProject,
  getProjects,
  getProjectByIdForUser,
};
