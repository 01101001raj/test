import DomainTracker from '../components/DomainTracker';

const fields = [
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'deepWork', label: 'Deep Work (hrs)', type: 'number' },
  { name: 'noFap', label: 'NoFap', type: 'checkbox' },
  { name: 'journaling', label: 'Journaling Done', type: 'checkbox' },
  { name: 'templeVisit', label: 'Temple Visit', type: 'checkbox' },
  { name: 'journalEntry', label: 'Journal Entry', type: 'text' },
];

const chartConfig = {
  type: 'line',
  fields: [
    { name: 'deepWork', label: 'Deep Work (hrs)' },
  ],
  colors: ['#60a5fa'],
};

export default function Mental() {
  return (
    <DomainTracker title="Mental Domain" fields={fields} storageKey="mentalData" chartConfig={chartConfig} />
  );
}