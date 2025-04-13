const API_URL = "http://localhost:8000/todo";

const getToken = () => localStorage.getItem("token");

const authHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks (unauthorized?)");
  }

  return response.json();
};

export const addTask = async (task) => {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(task),
  });

  return response.json();
};

export const editTask = async (id, updatedTask) => {
  const response = await fetch(`${API_URL}/edit/${id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify(updatedTask),
  });

  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.json();
};

export const completeTask = async (id) => {
  const response = await fetch(`${API_URL}/complete/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.json();
};
