import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { projectsService, tasksService } from '../lib/database';
import { Plus, Trash2, FolderOpen, CheckCircle, Circle, Edit3, Save, X } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    description: ''
  });
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    projectId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectsService.getAll(),
        tasksService.getByProject ? [] : [], // Fallback if method doesn't exist
      ]);
      
      setProjects(projectsData);
      
      // Load all tasks
      const allTasks = [];
      for (const project of projectsData) {
        const projectTasks = await tasksService.getByProject(project.id);
        allTasks.push(...projectTasks);
      }
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading projects and tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectFormData.name.trim()) return;

    try {
      if (editingProject) {
        await projectsService.update(editingProject.id, {
          name: projectFormData.name,
          description: projectFormData.description
        });
        setEditingProject(null);
      } else {
        await projectsService.add({
          name: projectFormData.name,
          description: projectFormData.description
        });
      }
      
      setProjectFormData({ name: '', description: '' });
      setShowProjectForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskFormData.title.trim() || !taskFormData.projectId) return;

    try {
      await tasksService.add({
        title: taskFormData.title,
        projectId: parseInt(taskFormData.projectId)
      });
      
      setTaskFormData({ title: '', projectId: '' });
      setShowTaskForm(false);
      loadData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        // Delete all tasks for this project first
        const projectTasks = tasks.filter(t => t.projectId === id);
        for (const task of projectTasks) {
          await tasksService.delete(task.id);
        }
        
        await projectsService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await tasksService.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskComplete = async (id) => {
    try {
      await tasksService.toggleComplete(id);
      loadData();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const editProject = (project) => {
    setProjectFormData({
      name: project.name,
      description: project.description || ''
    });
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const cancelProjectEdit = () => {
    setEditingProject(null);
    setProjectFormData({ name: '', description: '' });
    setShowProjectForm(false);
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const completedTasks = projectTasks.filter(t => t.completed);
    const total = projectTasks.length;
    const completed = completedTasks.length;
    const percentage = total > 0 ? (completed / total * 100) : 0;
    
    return { total, completed, percentage: percentage.toFixed(1) };
  };

  const getChartData = () => {
    return projects.map(project => {
      const progress = getProjectProgress(project.id);
      return {
        name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
        completed: progress.completed,
        total: progress.total,
        percentage: parseFloat(progress.percentage)
      };
    });
  };

  const getOverallStats = () => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completedProjects = projects.filter(project => {
      const progress = getProjectProgress(project.id);
      return progress.total > 0 && progress.completed === progress.total;
    }).length;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      completedProjects,
      overallProgress: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const chartData = getChartData();
  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FolderOpen className="mr-3" />
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your projects and track progress</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="btn-secondary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Task
          </button>
          <button
            onClick={() => setShowProjectForm(!showProjectForm)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalProjects}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Projects</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completedProjects}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalTasks}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.completedTasks}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</h3>
          <p className="text-2xl font-bold text-indigo-600">{stats.overallProgress}%</p>
        </div>
      </div>

      {/* Add Project Form */}
      {showProjectForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h2>
            {editingProject && (
              <button
                onClick={cancelProjectEdit}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectFormData.name}
                onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                className="input-field"
                placeholder="Enter project name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optional)
              </label>
              <textarea
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Project description..."
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary flex items-center">
                <Save size={16} className="mr-2" />
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => editingProject ? cancelProjectEdit() : setShowProjectForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Task Form */}
      {showTaskForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h2>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project
              </label>
              <select
                value={taskFormData.projectId}
                onChange={(e) => setTaskFormData({ ...taskFormData, projectId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={taskFormData.title}
                onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                className="input-field"
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" />
              <Bar dataKey="total" fill="#e5e7eb" name="Total Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Projects List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Projects</h3>
        {projects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No projects yet. Create your first project to start organizing your tasks!
          </p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const progress = getProjectProgress(project.id);
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              
              return (
                <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          progress.percentage == 100
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : progress.percentage > 0
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {progress.completed}/{progress.total} tasks • {progress.percentage}%
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {project.description}
                        </p>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => editProject(project)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2">
                    {projectTasks.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No tasks yet. Add some tasks to get started!
                      </p>
                    ) : (
                      projectTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleTaskComplete(task.id)}
                              className={`${
                                task.completed 
                                  ? 'text-green-600' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                            </button>
                            <span className={`${
                              task.completed 
                                ? 'line-through text-gray-500 dark:text-gray-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {task.title}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;