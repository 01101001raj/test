import Dexie from 'dexie';

export class SaiOSDatabase extends Dexie {
  constructor() {
    super('SaiOSDatabase');
    
    this.version(1).stores({
      physical: '++id, date, type, value, notes',
      mental: '++id, date, type, value, notes',
      finance: '++id, date, type, amount, category, notes',
      addiction: '++id, date, type, count, notes',
      rituals: '++id, date, type, completed, notes',
      journal: '++id, date, content, mood',
      projects: '++id, name, description, createdAt, status',
      tasks: '++id, projectId, title, completed, createdAt, completedAt'
    });
  }
}

export const db = new SaiOSDatabase();

// Helper functions for each domain
export const physicalService = {
  add: (entry) => db.physical.add({ ...entry, date: new Date().toISOString() }),
  getAll: () => db.physical.orderBy('date').reverse().toArray(),
  getByDateRange: (startDate, endDate) => 
    db.physical.where('date').between(startDate, endDate).toArray(),
  delete: (id) => db.physical.delete(id)
};

export const mentalService = {
  add: (entry) => db.mental.add({ ...entry, date: new Date().toISOString() }),
  getAll: () => db.mental.orderBy('date').reverse().toArray(),
  getByDateRange: (startDate, endDate) => 
    db.mental.where('date').between(startDate, endDate).toArray(),
  delete: (id) => db.mental.delete(id)
};

export const financeService = {
  add: (entry) => db.finance.add({ ...entry, date: new Date().toISOString() }),
  getAll: () => db.finance.orderBy('date').reverse().toArray(),
  getByDateRange: (startDate, endDate) => 
    db.finance.where('date').between(startDate, endDate).toArray(),
  delete: (id) => db.finance.delete(id),
  getTotalsByCategory: async () => {
    const entries = await db.finance.toArray();
    const totals = {};
    entries.forEach(entry => {
      if (!totals[entry.category]) totals[entry.category] = 0;
      totals[entry.category] += entry.amount;
    });
    return totals;
  }
};

export const addictionService = {
  add: (entry) => db.addiction.add({ ...entry, date: new Date().toISOString() }),
  getAll: () => db.addiction.orderBy('date').reverse().toArray(),
  getByDateRange: (startDate, endDate) => 
    db.addiction.where('date').between(startDate, endDate).toArray(),
  delete: (id) => db.addiction.delete(id)
};

export const ritualsService = {
  add: (entry) => db.rituals.add({ ...entry, date: new Date().toISOString() }),
  getAll: () => db.rituals.orderBy('date').reverse().toArray(),
  getByDateRange: (startDate, endDate) => 
    db.rituals.where('date').between(startDate, endDate).toArray(),
  delete: (id) => db.rituals.delete(id),
  update: (id, updates) => db.rituals.update(id, updates)
};

export const journalService = {
  add: (entry) => db.journal.add({ ...entry, date: new Date().toISOString() }),
  getAll: () => db.journal.orderBy('date').reverse().toArray(),
  getByDateRange: (startDate, endDate) => 
    db.journal.where('date').between(startDate, endDate).toArray(),
  delete: (id) => db.journal.delete(id),
  update: (id, updates) => db.journal.update(id, updates)
};

export const projectsService = {
  add: (project) => db.projects.add({ 
    ...project, 
    createdAt: new Date().toISOString(),
    status: 'active'
  }),
  getAll: () => db.projects.orderBy('createdAt').reverse().toArray(),
  update: (id, updates) => db.projects.update(id, updates),
  delete: (id) => db.projects.delete(id),
  getWithTasks: async (id) => {
    const project = await db.projects.get(id);
    const tasks = await db.tasks.where('projectId').equals(id).toArray();
    return { ...project, tasks };
  }
};

export const tasksService = {
  add: (task) => db.tasks.add({ 
    ...task, 
    createdAt: new Date().toISOString(),
    completed: false
  }),
  getByProject: (projectId) => db.tasks.where('projectId').equals(projectId).toArray(),
  update: (id, updates) => db.tasks.update(id, updates),
  delete: (id) => db.tasks.delete(id),
  toggleComplete: async (id) => {
    const task = await db.tasks.get(id);
    return db.tasks.update(id, { 
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    });
  }
};