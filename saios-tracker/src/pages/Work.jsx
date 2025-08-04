import DomainTracker from '../components/DomainTracker';

const fields = [
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'projectName', label: 'Project Name', type: 'text' },
  { name: 'taskName', label: 'Task Name', type: 'text' },
  { name: 'taskStatus', label: 'Task Status', type: 'select', options: ['To Do', 'In Progress', 'Done'] },
];

export default function Work() {
  return <DomainTracker title="Work/Wealth Domain" fields={fields} storageKey="workData" />;
}