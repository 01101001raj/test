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
        name: newProjectName.trim(),
        tasks: [],
        createdAt: new Date().toISOString()
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
    }
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const addTask = (projectId) => {
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now(),
        name: newTaskName.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      ));
      setNewTaskName('');
    }
  };

  const toggleTask = (projectId, taskId) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
            )
          }
        : project
    ));
  };

  const deleteTask = (projectId, taskId) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId)
          }
        : project
    ));
  };

  const getProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Project Dashboard</h1>

      {/* Add New Project */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Create New Project</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="input-field flex-1"
            placeholder="Enter project name..."
          />
          <button 
            onClick={addProject}
            disabled={!newProjectName.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          const progress = getProgress(project.tasks);
          const completedTasks = project.tasks.filter(task => task.completed).length;
          const totalTasks = project.tasks.length;

          return (
            <div key={project.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">{project.name}</h3>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {completedTasks} of {totalTasks} tasks completed
                </div>
              </div>

              {/* Add Task */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="input-field flex-1 text-sm"
                    placeholder="Add task..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTask(project.id);
                      }
                    }}
                  />
                  <button 
                    onClick={() => addTask(project.id)}
                    disabled={!newTaskName.trim()}
                    className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {project.tasks.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-2">
                    No tasks yet
                  </div>
                ) : (
                  project.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(project.id, task.id)}
                        className="rounded"
                      />
                      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.name}
                      </span>
                      <button
                        onClick={() => deleteTask(project.id, task.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="card p-6 text-center text-gray-500">
          No projects yet. Create your first project above.
        </div>
      )}
    </div>
  );
}