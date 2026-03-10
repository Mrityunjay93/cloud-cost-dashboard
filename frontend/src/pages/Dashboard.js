import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CostChart from "../components/CostChart";
import API from "../services/api";
import { getActiveProjectId, setActiveProjectId } from "../services/auth";

function Dashboard(){

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [resources,setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(()=>{
    fetchProjects();
  },[]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchResources(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    setLoading(true);
    setMessage("");

    try{
      const res = await API.get("/projects");
      const allProjects = res.data || [];
      setProjects(allProjects);

      if (!allProjects.length) {
        setResources([]);
        setMessage("No projects yet. Create one to start tracking costs.");
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

  const fetchResources = async(projectId)=>{
    setLoading(true);
    setMessage("");

    try{
      const res = await API.get(`/resources/${projectId}`);
      setResources(res.data);
    }catch(err){
      setResources([]);
      setMessage(err.response?.data?.message || err.response?.data?.error || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const onProjectChange = (event) => {
    const value = event.target.value;
    setSelectedProjectId(value);
    setActiveProjectId(value);
  };

  const totalCost = resources.reduce((sum, item) => sum + Number(item.total_cost || 0), 0);

  return(
    <div className="app-shell">
      <Navbar/>
      <div className="shell-body">
        <Sidebar/>
        <main className="content-area">
          <section className="page-card">
            <div className="page-header-row">
              <div>
                <h2>Dashboard</h2>
                <p className="page-subtitle">Resource cost overview by project.</p>
              </div>
              <div className="project-select-wrap">
                <label htmlFor="projectSelector">Project</label>
                <select
                  id="projectSelector"
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
            </div>
            {loading ? <p className="info-text">Loading data...</p> : null}
            {!loading && message ? <p className="info-text">{message}</p> : null}
            {!loading && projects.length ? (
              <>
                <p className="stat-line">Total Cost: <strong>${totalCost.toFixed(2)}</strong></p>
                <div className="chart-wrap">
                  <CostChart data={resources}/>
                </div>
              </>
            ) : null}
            {!loading && !projects.length ? (
              <button className="primary-btn" onClick={() => navigate("/projects")}>
                Create Project
              </button>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );

}

export default Dashboard;
