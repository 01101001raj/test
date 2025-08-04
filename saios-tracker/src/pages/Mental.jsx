import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'meditation', label: 'Meditation (minutes)', type: 'number', placeholder: '20' },
  { name: 'mood', label: 'Mood', type: 'select', options: ['Excellent', 'Good', 'Neutral', 'Bad', 'Terrible'] },
  { name: 'therapy', label: 'Therapy Session', type: 'checkbox' },
  { name: 'reading', label: 'Reading (minutes)', type: 'number', placeholder: '30' },
  { name: 'gratitude', label: 'Gratitude Practice', type: 'checkbox' },
  { name: 'stress', label: 'Stress Level (1-10)', type: 'number', placeholder: '5' },
];

const chartConfig = {
  fields: [
    { name: 'meditation', label: 'Meditation' },
    { name: 'reading', label: 'Reading' },
    { name: 'stress', label: 'Stress Level' },
  ],
  colors: ['#8B5CF6', '#06B6D4', '#EF4444'],
};

export default function Mental() {
  return (
    <EnhancedDomainTracker title="Mental Health" fields={fields} storageKey="mental" chartConfig={chartConfig} />
  );
}