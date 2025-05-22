/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;
const DEVELOPMENT_URL = process.env.REACT_APP_API_URL_DEVELOPMENT;
const PRODUCTION_URL = process.env.REACT_APP_API_URL_PRODUCTION;
const API_URL = ENVIRONMENT === "development" ? DEVELOPMENT_URL : PRODUCTION_URL;

const rest = {
  getToken: () => {
    return localStorage.getItem("token");
  },
  get: async (url) => {
    const token = rest.getToken();
    const response = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message);

    return data;
  },
  post: async (url, body) => {
    const token = rest.getToken();
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message);

    return data;
  },
  put: async (url, body) => {
    const token = rest.getToken();
    const response = await fetch(`${API_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message);

    return data;
  },
  delete: async (url) => {
    const token = rest.getToken();
    const response = await fetch(`${API_URL}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message);

    return data;
  },
}

export default rest;