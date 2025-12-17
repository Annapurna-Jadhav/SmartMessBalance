let accessToken: string | null = localStorage.getItem("accessToken");

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
};

export const clearAuth = () => {
  accessToken = null;
  localStorage.removeItem("accessToken");
};
