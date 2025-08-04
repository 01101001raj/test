import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'wakeTime', label: 'Wake Time', type: 'time' },
  { name: 'templeVisit', label: 'Temple Visit', type: 'checkbox' },
  { name: 'walk', label: 'Walk (minutes)', type: 'number', placeholder: '30' },
  { name: 'coldShower', label: 'Cold Shower', type: 'checkbox' },
  { name: 'prayer', label: 'Prayer (minutes)', type: 'number', placeholder: '10' },
  { name: 'reading', label: 'Reading (minutes)', type: 'number', placeholder: '20' },
  { name: 'journaling', label: 'Journaling', type: 'checkbox' },
];

const chartConfig = {
  fields: [
    { name: 'walk', label: 'Walk' },
    { name: 'prayer', label: 'Prayer' },
    { name: 'reading', label: 'Reading' },
  ],
  colors: ['#10B981', '#8B5CF6', '#F59E0B'],
};

export default function Rituals() {
  return (
    <EnhancedDomainTracker
      title="Daily Rituals Tracker"
      fields={fields}
      storageKey="rituals-entries"
      chartConfig={chartConfig}
    />
  );
}