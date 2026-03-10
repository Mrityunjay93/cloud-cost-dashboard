import React,{useState} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getActiveProjectId, setActiveProjectId } from "../services/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Resources(){

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(getActiveProjectId() || "");
  const [name,setName] = useState("");
  const [provider,setProvider] = useState("");
  const [cost,setCost] = useState("");
  const [hours,setHours] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchResources(selectedProjectId);
    } else {
      setResources([]);
      setLoading(false);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await API.get("/projects");
      const allProjects = res.data || [];
      setProjects(allProjects);

      if (!allProjects.length) {
        setMessage("No projects yet. Create a project before adding resources.");
        setLoading(false);
        return;
      }

      const storedId = getActiveProjectId();
      const exists = allProjects.find((project) => String(project.id) === String(storedId));
      const initialProjectId = exists ? exists.id : allProjects[0].id;
      setSelectedProjectId(String(initialProjectId));
      setActiveProjectId(initialProjectId);
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.error || "Failed to load projects");
      setLoading(false);
    }
  };

  const fetchResources = async (projectId) => {
    setLoading(true);

    try {
      const res = await API.get(`/resources/${projectId}`);
      setResources(res.data || []);
    } catch (err) {
      setResources([]);
      setMessage(err.response?.data?.message || err.response?.data?.error || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const addResource = async()=>{
    const parsedCost = Number(cost);
    const parsedHours = Number(hours);

    if (!selectedProjectId || !name.trim() || !provider.trim() || Number.isNaN(parsedCost) || Number.isNaN(parsedHours)) {
      setMessage("Please complete all resource fields");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await API.post("/resources",{
        project_id: Number(selectedProjectId),
        name: name.trim(),
        provider: provider.trim(),
        cost_per_hour: parsedCost,
        usage_hours: parsedHours
      });

      setName("");
      setProvider("");
      setCost("");
      setHours("");
      setMessage("Resource added");
      fetchResources(selectedProjectId);
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.error || "Unable to add resource");
    } finally {
      setSubmitting(false);
    }

  };

  const onProjectChange = (event) => {
    const value = event.target.value;
    setSelectedProjectId(value);
    setActiveProjectId(value);
    setMessage("");
  };

  return(
    <div className="app-shell">
      <Navbar/>
      <div className="shell-body">
        <Sidebar/>
        <main className="content-area">
          <section className="page-card">
            <h2>Add Resource</h2>
            <p className="page-subtitle">Track provider usage and hourly costs.</p>
            <div className="project-select-wrap form-field">
              <label htmlFor="resourceProjectSelector">Project</label>
              <select
                id="resourceProjectSelector"
                className="select-input"
                value={selectedProjectId}
                onChange={onProjectChange}
                disabled={!projects.length}
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="form-grid">
              <input className="text-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
              <input className="text-input" placeholder="Provider" value={provider} onChange={e=>setProvider(e.target.value)}/>
              <input className="text-input" placeholder="Cost/hour" value={cost} onChange={e=>setCost(e.target.value)}/>
              <input className="text-input" placeholder="Usage hours" value={hours} onChange={e=>setHours(e.target.value)}/>
            </div>
            <button className="primary-btn" onClick={addResource} disabled={!projects.length || submitting}>
              {submitting ? "Adding..." : "Add"}
            </button>
            {message ? <p className="info-text">{message}</p> : null}
            {!projects.length ? (
              <button className="text-btn" onClick={() => navigate("/projects")}>Go to Projects</button>
            ) : null}
            <h3 className="section-heading">Recent Resources</h3>
            {loading ? <p className="info-text">Loading resources...</p> : null}
            <ul className="list-card">
              {resources.map((resource) => (
                <li key={resource.id}>
                  {resource.name} ({resource.provider}) - ${Number(resource.total_cost || 0).toFixed(2)}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );

}

export default Resources;
