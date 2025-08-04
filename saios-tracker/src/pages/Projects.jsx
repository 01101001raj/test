import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

export default function Projects() {
  const [projects, setProjects] = useLocalStorage('projectsData', []);
  const [projectName, setProjectName] = useState('');
  const [taskInputs, setTaskInputs] = useState({});

  // Add new project
  const createProject = () => {
    if (!projectName.trim()) return;
    setProjects([
      ...projects,
      { id: uuidv4(), name: projectName.trim(), tasks: [] },
    ]);
    setProjectName('');
  };

  // Add new task to given project id
  const addTask = (projectId) => {
    const title = (taskInputs[projectId] || '').trim();
    if (!title) return;
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: [...p.tasks, { id: uuidv4(), title, done: false }] }
          : p
      )
    );
    setTaskInputs({ ...taskInputs, [projectId]: '' });
  };

  // Toggle task done status
  const toggleTask = (projectId, taskId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : p
      )
    );
  };

  // Delete task
  const deleteTask = (projectId, taskId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
          : p
      )
    );
  };

  // Delete project
  const deleteProject = (projectId) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>

      {/* Create Project */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button onClick={createProject} className="bg-black text-white rounded px-4 py-2">
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => {
          const completedTasks = project.tasks.filter((t) => t.done).length;
          const progress = project.tasks.length ? (completedTasks / project.tasks.length) * 100 : 0;
          return (
            <div key={project.id} className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">{project.name}</h2>
                <button onClick={() => deleteProject(project.id)} className="text-red-500 text-sm">
                  Delete
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded mb-4">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm mb-4">
                {completedTasks} / {project.tasks.length} tasks completed
              </p>

              {/* Add task */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="New task"
                  value={taskInputs[project.id] || ''}
                  onChange={(e) => setTaskInputs({ ...taskInputs, [project.id]: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <button onClick={() => addTask(project.id)} className="bg-black text-white rounded px-4 py-2">
                  Add Task
                </button>
              </div>

              {/* Tasks List */}
              <ul className="space-y-2">
                {project.tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between border rounded p-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(project.id, task.id)}
                      />
                      <span className={task.done ? 'line-through' : ''}>{task.title}</span>
                    </div>
                    <button onClick={() => deleteTask(project.id, task.id)} className="text-red-500 text-xs">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}