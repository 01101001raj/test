import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Briefcase, CheckCircle, Circle, Calendar, Target } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { format } from 'date-fns'
import WealthWorkChart from './charts/WealthWorkChart'

const TASK_STATUSES = ['To Do', 'In Progress', 'Done']

const WealthWorkDomain = () => {
  const [projects, setProjects] = useLocalStorage('projects-data', [])
  const [activeTab, setActiveTab] = useState('projects')
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    tasks: []
  })

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'To Do'
  })

  const [isEditingTask, setIsEditingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)

  const handleProjectSubmit = (e) => {
    e.preventDefault()
    
    if (isEditingProject) {
      setProjects(projects.map(project => 
        project.id === editingProjectId ? { ...projectForm, id: editingProjectId } : project
      ))
      setIsEditingProject(false)
      setEditingProjectId(null)
    } else {
      const newProject = {
        ...projectForm,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        tasks: []
      }
      setProjects([...projects, newProject])
    }
    
    resetProjectForm()
  }

  const handleTaskSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedProject) return

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        let updatedTasks
        
        if (isEditingTask) {
          updatedTasks = project.tasks.map(task =>
            task.id === editingTaskId ? { ...taskForm, id: editingTaskId } : task
          )
          setIsEditingTask(false)
          setEditingTaskId(null)
        } else {
          const newTask = {
            ...taskForm,
            id: Date.now(),
            createdAt: new Date().toISOString()
          }
          updatedTasks = [...project.tasks, newTask]
        }
        
        return { ...project, tasks: updatedTasks }
      }
      return project
    })
    
    setProjects(updatedProjects)
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id))
    resetTaskForm()
  }

  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      tasks: []
    })
  }

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'To Do'
    })
  }

  const handleEditProject = (project) => {
    setProjectForm(project)
    setIsEditingProject(true)
    setEditingProjectId(project.id)
  }

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      setProjects(projects.filter(project => project.id !== id))
      if (selectedProject && selectedProject.id === id) {
        setSelectedProject(null)
      }
    }
  }

  const handleEditTask = (task) => {
    setTaskForm(task)
    setIsEditingTask(true)
    setEditingTaskId(task.id)
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId)
          }
        }
        return project
      })
      
      setProjects(updatedProjects)
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id))
    }
  }

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length
    return Math.round((completedTasks / project.tasks.length) * 100)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'In Progress':
        return <Circle className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Wealth/Work Domain</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Briefcase className="h-4 w-4" />
          <span>{projects.length} projects</span>
        </div>
      </div>

      {/* Charts */}
      {projects.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Project Progress Overview</h3>
          <WealthWorkChart projects={projects} />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Projects
          </button>
          {selectedProject && (
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Tasks - {selectedProject.name}
            </button>
          )}
        </nav>
      </div>

      {activeTab === 'projects' && (
        <>
          {/* Add/Edit Project Form */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              {isEditingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={projectForm.name}
                    onChange={handleProjectInputChange}
                    className="input-field"
                    required
                    placeholder="Enter project name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={projectForm.startDate}
                    onChange={handleProjectInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleProjectInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Project description..."
                />
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditingProject ? 'Update Project' : 'Add Project'}
                </button>
                {isEditingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProject(false)
                      setEditingProjectId(null)
                      resetProjectForm()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Projects List */}
          {projects.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Projects</h3>
              <div className="space-y-4">
                {projects.map((project) => {
                  const progress = calculateProgress(project)
                  return (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {project.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Started: {project.startDate}
                            </div>
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              {project.tasks?.length || 0} tasks
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedProject(project)
                              setActiveTab('tasks')
                            }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                          >
                            View Tasks
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <div className="card text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Briefcase className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start by creating your first project above.
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === 'tasks' && selectedProject && (
        <>
          {/* Add/Edit Task Form */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              {isEditingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleTaskInputChange}
                    className="input-field"
                    required
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleTaskInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={taskForm.status}
                  onChange={handleTaskInputChange}
                  className="input-field max-w-xs"
                  required
                >
                  {TASK_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Task description..."
                />
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  {isEditingTask ? 'Update Task' : 'Add Task'}
                </button>
                {isEditingTask && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTask(false)
                      setEditingTaskId(null)
                      resetTaskForm()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tasks List */}
          {selectedProject.tasks && selectedProject.tasks.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Tasks for {selectedProject.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="table-header">Status</th>
                      <th className="table-header">Title</th>
                      <th className="table-header">Description</th>
                      <th className="table-header">Due Date</th>
                      <th className="table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedProject.tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="table-cell">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(task.status)}
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell font-medium">{task.title}</td>
                        <td className="table-cell">{task.description || '-'}</td>
                        <td className="table-cell">{task.dueDate}</td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(!selectedProject.tasks || selectedProject.tasks.length === 0) && (
            <div className="card text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Target className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Add your first task to get started with this project.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WealthWorkDomain