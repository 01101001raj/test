import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, TrendingUp } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { format } from 'date-fns'
import PhysicalChart from './charts/PhysicalChart'

const PhysicalDomain = () => {
  const [data, setData] = useLocalStorage('physical-data', [])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    wakeTime: '',
    sleepTime: '',
    cigarettes: 0,
    screenTime: 0,
    gym: false,
    workoutDuration: 0,
    coldShower: false,
    boxingPracticed: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isEditing) {
      setData(data.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      ))
      setIsEditing(false)
      setEditingId(null)
    } else {
      const newEntry = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }
      setData([...data, newEntry])
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      wakeTime: '',
      sleepTime: '',
      cigarettes: 0,
      screenTime: 0,
      gym: false,
      workoutDuration: 0,
      coldShower: false,
      boxingPracticed: false
    })
  }

  const handleEdit = (item) => {
    setFormData(item)
    setIsEditing(true)
    setEditingId(item.id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setData(data.filter(item => item.id !== id))
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }))
  }

  // Sort data by date (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Physical Domain</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <TrendingUp className="h-4 w-4" />
          <span>{data.length} entries</span>
        </div>
      </div>

      {/* Chart */}
      {data.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Physical Activity Trends</h3>
          <PhysicalChart data={sortedData} />
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Entry' : 'Add New Entry'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Wake Time</label>
            <input
              type="time"
              name="wakeTime"
              value={formData.wakeTime}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sleep Time</label>
            <input
              type="time"
              name="sleepTime"
              value={formData.sleepTime}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cigarettes</label>
            <input
              type="number"
              name="cigarettes"
              value={formData.cigarettes}
              onChange={handleInputChange}
              min="0"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Screen Time (hours)</label>
            <input
              type="number"
              name="screenTime"
              value={formData.screenTime}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Workout Duration (minutes)</label>
            <input
              type="number"
              name="workoutDuration"
              value={formData.workoutDuration}
              onChange={handleInputChange}
              min="0"
              className="input-field"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="gym"
                checked={formData.gym}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Gym</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="coldShower"
                checked={formData.coldShower}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Cold Shower</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="boxingPracticed"
                checked={formData.boxingPracticed}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Boxing</span>
            </label>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex space-x-2">
            <button type="submit" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Entry' : 'Add Entry'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setEditingId(null)
                  resetForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Data Table */}
      {data.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Physical Activity Log</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Wake Time</th>
                  <th className="table-header">Sleep Time</th>
                  <th className="table-header">Cigarettes</th>
                  <th className="table-header">Screen Time</th>
                  <th className="table-header">Gym</th>
                  <th className="table-header">Workout (min)</th>
                  <th className="table-header">Cold Shower</th>
                  <th className="table-header">Boxing</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="table-cell font-medium">{item.date}</td>
                    <td className="table-cell">{item.wakeTime || '-'}</td>
                    <td className="table-cell">{item.sleepTime || '-'}</td>
                    <td className="table-cell">{item.cigarettes}</td>
                    <td className="table-cell">{item.screenTime}h</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.gym 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {item.gym ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="table-cell">{item.workoutDuration}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.coldShower 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {item.coldShower ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.boxingPracticed 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {item.boxingPracticed ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

      {data.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <TrendingUp className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No physical activity data yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start tracking your physical activities by adding your first entry above.
          </p>
        </div>
      )}
    </div>
  )
}

export default PhysicalDomain