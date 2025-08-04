import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Brain, BookOpen, Calendar } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { format } from 'date-fns'
import MentalChart from './charts/MentalChart'

const MentalDomain = () => {
  const [data, setData] = useLocalStorage('mental-data', [])
  const [journalEntries, setJournalEntries] = useLocalStorage('journal-entries', [])
  const [activeTab, setActiveTab] = useState('tracker')
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    deepWork: 0,
    noFap: false,
    journalingDone: false,
    templeVisit: false
  })

  const [journalForm, setJournalForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    entry: ''
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

  const handleJournalSubmit = (e) => {
    e.preventDefault()
    
    const newJournalEntry = {
      ...journalForm,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    
    setJournalEntries([newJournalEntry, ...journalEntries])
    setJournalForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      entry: ''
    })
  }

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      deepWork: 0,
      noFap: false,
      journalingDone: false,
      templeVisit: false
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

  const handleDeleteJournal = (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      setJournalEntries(journalEntries.filter(item => item.id !== id))
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }))
  }

  const handleJournalInputChange = (e) => {
    const { name, value } = e.target
    setJournalForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Sort data by date (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Mental Domain</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Brain className="h-4 w-4" />
          <span>{data.length} entries</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tracker'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Mental Tracker
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'journal'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Journal Entries
          </button>
        </nav>
      </div>

      {activeTab === 'tracker' && (
        <>
          {/* Chart */}
          {data.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Mental Activity Trends</h3>
              <MentalChart data={sortedData} />
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
                <label className="block text-sm font-medium mb-1">Deep Work (hours)</label>
                <input
                  type="number"
                  name="deepWork"
                  value={formData.deepWork}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="input-field"
                />
              </div>

              <div className="flex items-center space-x-6 pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="noFap"
                    checked={formData.noFap}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">NoFap</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="journalingDone"
                    checked={formData.journalingDone}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Journaling Done</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="templeVisit"
                    checked={formData.templeVisit}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Temple Visit</span>
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
              <h3 className="text-lg font-semibold mb-4">Mental Activity Log</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="table-header">Date</th>
                      <th className="table-header">Deep Work (hours)</th>
                      <th className="table-header">NoFap</th>
                      <th className="table-header">Journaling Done</th>
                      <th className="table-header">Temple Visit</th>
                      <th className="table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="table-cell font-medium">{item.date}</td>
                        <td className="table-cell">{item.deepWork}</td>
                        <td className="table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            item.noFap 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {item.noFap ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            item.journalingDone 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {item.journalingDone ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            item.templeVisit 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {item.templeVisit ? 'Yes' : 'No'}
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
                <Brain className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No mental activity data yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start tracking your mental activities by adding your first entry above.
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === 'journal' && (
        <>
          {/* Journal Entry Form */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Add Journal Entry</h3>
            
            <form onSubmit={handleJournalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={journalForm.date}
                  onChange={handleJournalInputChange}
                  className="input-field max-w-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Journal Entry</label>
                <textarea
                  name="entry"
                  value={journalForm.entry}
                  onChange={handleJournalInputChange}
                  rows={6}
                  className="input-field"
                  placeholder="Write your thoughts, reflections, or experiences..."
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                <BookOpen className="h-4 w-4 mr-2" />
                Add Journal Entry
              </button>
            </form>
          </div>

          {/* Journal Entries List */}
          {journalEntries.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Journal Entries</h3>
              {journalEntries.map((entry) => (
                <div key={entry.id} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{entry.date}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteJournal(entry.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{entry.entry}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {journalEntries.length === 0 && (
            <div className="card text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <BookOpen className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No journal entries yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start journaling by adding your first entry above.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MentalDomain