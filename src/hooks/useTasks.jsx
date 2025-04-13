// src/hooks/useTasks.jsx
import { useState, useEffect } from "react";
import {
  fetchTasks,
  addTask,
  editTask,
  deleteTask,
  completeTask,
} from "../api";

const useTasks = () => {
  const [tasksGrouped, setTasksGrouped] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasksGrouped(data.tasks_grouped);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (task) => {
    await addTask(task);
    await loadTasks();
  };

  const handleEdit = async (id, task) => {
    await editTask(id, task);
    await loadTasks();
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    await loadTasks();
  };

  const handleComplete = async (id) => {
    await completeTask(id);
    await loadTasks();
  };

  return {
    tasksGrouped,
    selectedGroup,
    setSelectedGroup,
    editingTask,
    setEditingTask,
    handleAdd,
    handleEdit,
    handleDelete,
    handleComplete,
  };
};

export default useTasks;
