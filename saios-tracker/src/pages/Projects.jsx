import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Projects() {
  const [projects, setProjects] = useLocalStorage('projects', []);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: newProjectName,
        tasks: [],
        createdAt: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
    }
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject === projectId) {
      setSelectedProject(null);
    }
  };

  const addTask = (projectId) => {
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now(),
        name: newTaskName,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setProjects(projects.map(p => 
        p.id === projectId 
          ? { ...p, tasks: [...p.tasks, newTask] }
          : p
      ));
      setNewTaskName('');
    }
  };

  const toggleTask = (projectId, taskId) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            tasks: p.tasks.map(t => 
              t.id === taskId 
                ? { ...t, completed: !t.completed }
                : t
            )
          }
        : p
    ));
  };

  const deleteTask = (projectId, taskId) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
        : p
    ));
  };

  const getProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Project Management</h1>

      {/* Add New Project */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <button
            onClick={addProject}
            disabled={!newProjectName.trim()}
            className="bg-black dark:bg-white text-white dark:text-black rounded px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div
            key={project.id}
            className={`bg-white dark:bg-gray-900 p-4 rounded shadow border-2 transition-colors cursor-pointer ${
              selectedProject === project.id 
                ? 'border-black dark:border-white' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => setSelectedProject(project.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                ×
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{getProgress(project.tasks)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress(project.tasks)}%` }}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {project.tasks.length} tasks • {project.tasks.filter(t => t.completed).length} completed
            </div>
          </div>
        ))}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {projects.find(p => p.id === selectedProject)?.name}
            </h2>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Close
            </button>
          </div>

          {/* Add Task */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="New task..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <button
              onClick={() => addTask(selectedProject)}
              disabled={!newTaskName.trim()}
              className="bg-black dark:bg-white text-white dark:text-black rounded px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Add Task
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {projects.find(p => p.id === selectedProject)?.tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(selectedProject, task.id)}
                  className="w-4 h-4"
                />
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.name}
                </span>
                <button
                  onClick={() => deleteTask(selectedProject, task.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            ))}
            {projects.find(p => p.id === selectedProject)?.tasks.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No tasks yet. Add your first task above.
              </p>
            )}
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No projects yet. Create your first project above.
        </p>
      )}
    </div>
  );
}