import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'meditation', label: 'Meditation (minutes)', type: 'number', placeholder: '20' },
  { name: 'mood', label: 'Mood (1-10)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { name: 'therapy', label: 'Therapy Session', type: 'checkbox' },
  { name: 'deepWork', label: 'Deep Work (hours)', type: 'number', placeholder: '4' },
  { name: 'reading', label: 'Reading (minutes)', type: 'number', placeholder: '30' },
  { name: 'gratitude', label: 'Gratitude Practice', type: 'checkbox' },
];

const chartConfig = {
  fields: [
    { name: 'meditation', label: 'Meditation' },
    { name: 'mood', label: 'Mood' },
    { name: 'deepWork', label: 'Deep Work' },
  ],
  colors: ['#8B5CF6', '#EC4899', '#06B6D4'],
};

export default function Mental() {
  return (
    <EnhancedDomainTracker
      title="Mental Health Tracker"
      fields={fields}
      storageKey="mental-entries"
      chartConfig={chartConfig}
    />
  );
}