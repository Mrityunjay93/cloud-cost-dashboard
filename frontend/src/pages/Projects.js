import React,{useCallback,useEffect,useState} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getActiveProjectId, setActiveProjectId } from "../services/auth";

function Projects(){

  const [projects,setProjects] = useState([]);
  const [name,setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(getActiveProjectId() || "");

  const fetchProjects = useCallback(async()=>{
    setLoading(true);
    setMessage("");

    try {
      const res = await API.get("/projects");
      const allProjects = res.data || [];
      setProjects(allProjects);

      if (!allProjects.length) {
        setSelectedProjectId("");
        setActiveProjectId("");
        return;
      }

      const hasStored = allProjects.some((project) => String(project.id) === String(selectedProjectId));
      const defaultId = hasStored ? selectedProjectId : allProjects[0].id;
      setSelectedProjectId(String(defaultId));
      setActiveProjectId(defaultId);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }

  }, [selectedProjectId]);

  useEffect(()=>{
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async()=>{
    const cleanedName = name.trim();

    if (!cleanedName) {
      setMessage("Project name is required");
      return;
    }

    setCreating(true);
    setMessage("");

    try {
      const res = await API.post("/projects",{ name: cleanedName });
      setName("");
      setSelectedProjectId(String(res.data.id));
      setActiveProjectId(res.data.id);
      setMessage("Project created");
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to create project");
    } finally {
      setCreating(false);
    }
  };

  const selectProject = (projectId) => {
    setSelectedProjectId(String(projectId));
    setActiveProjectId(projectId);
  };

  return(
    <div className="app-shell">
      <Navbar/>
      <div className="shell-body">
        <Sidebar/>
        <main className="content-area">
          <section className="page-card">
            <h2>Projects</h2>
            <p className="page-subtitle">Create and list your projects.</p>
            <div className="form-row">
              <input
                className="text-input"
                placeholder="Project name"
                value={name}
                onChange={e=>setName(e.target.value)}
              />
              <button className="primary-btn" onClick={createProject} disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
            {message ? <p className="info-text">{message}</p> : null}
            {loading ? <p className="info-text">Loading projects...</p> : null}
            <ul className="list-card">
              {projects.map(p=>(
                <li key={p.id} className="list-item-row">
                  <span>{p.name}</span>
                  <button
                    className={`tag-btn${String(p.id) === String(selectedProjectId) ? " active" : ""}`}
                    onClick={() => selectProject(p.id)}
                  >
                    {String(p.id) === String(selectedProjectId) ? "Selected" : "Select"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );

}

export default Projects;
