import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Menu</h3>
      <ul className="sidebar-list">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/resources" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            Resources
          </NavLink>
        </li>
      </ul>
    </aside>
  );

}

export default Sidebar;
