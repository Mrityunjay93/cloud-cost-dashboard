import React from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../services/auth";

function Navbar() {

  const navigate = useNavigate();
  const user = getStoredUser();

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <header className="topbar">
      <span className="topbar-title">Cloud Cost Monitor</span>
      <div className="topbar-right">
        <span className="topbar-user">{user?.name || user?.email || "User"}</span>
        <button className="topbar-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );

}

export default Navbar;
