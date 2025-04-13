import React, { useState, useEffect } from "react";
import useTasks from "../hooks/useTasks";
import TaskGroup from "../components/TaskGroup";
import TaskForm from "../components/TaskForm";

const TaskPage = () => {
  const {
    tasksGrouped,
    editingTask,
    setEditingTask,
    handleAdd,
    handleEdit,
    handleDelete,
    handleComplete,
  } = useTasks();

  const [selectedGroup, setSelectedGroup] = useState("All");

  const groupNames = Object.keys(tasksGrouped);

  const filteredTasks = selectedGroup === "All"
    ? tasksGrouped
    : {
        [selectedGroup]: tasksGrouped[selectedGroup] || []
      };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", marginRight: "20px" }}>
        <h3>Groups</h3>
        <button
          onClick={() => setSelectedGroup("All")}
          style={{ marginBottom: "10px" }}
        >
          All Tasks
        </button>
        <ul>
          {groupNames.map((group) => (
            <li
              key={group}
              style={{
                cursor: "pointer",
                fontWeight: selectedGroup === group ? "bold" : "normal",
              }}
              onClick={() => setSelectedGroup(group)}
            >
              {group || "Others"}
            </li>
          ))}
        </ul>
      </div>

      {/* Task Content */}
      <div style={{ flexGrow: 1 }}>
        <TaskForm
          onSubmit={handleAdd}
          editingTask={editingTask}
          onEdit={handleEdit}
        />
        <hr />
        {Object.entries(filteredTasks).map(([group, tasks]) => (
          <TaskGroup
            key={group}
            group={group || "Others"}
            tasks={tasks}
            onEditClick={setEditingTask}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskPage;
