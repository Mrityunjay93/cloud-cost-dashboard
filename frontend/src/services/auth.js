const TOKEN_KEY = "token";
const USER_KEY = "user";
const ACTIVE_PROJECT_KEY = "activeProjectId";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACTIVE_PROJECT_KEY);
};

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getActiveProjectId = () => localStorage.getItem(ACTIVE_PROJECT_KEY);

export const setActiveProjectId = (projectId) => {
  if (!projectId) {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
    return;
  }

  localStorage.setItem(ACTIVE_PROJECT_KEY, String(projectId));
};
