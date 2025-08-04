import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'earlyWake', label: 'Early Wake-up', type: 'checkbox' },
  { name: 'wakeTime', label: 'Wake Time', type: 'time' },
  { name: 'templeVisit', label: 'Temple Visit', type: 'checkbox' },
  { name: 'walk', label: 'Walk (minutes)', type: 'number', placeholder: '30' },
  { name: 'prayer', label: 'Prayer (minutes)', type: 'number', placeholder: '15' },
  { name: 'coldShower', label: 'Cold Shower', type: 'checkbox' },
  { name: 'fasting', label: 'Fasting', type: 'checkbox' },
  { name: 'meditation', label: 'Meditation (minutes)', type: 'number', placeholder: '20' },
];

const chartConfig = {
  fields: [
    { name: 'walk', label: 'Walk' },
    { name: 'prayer', label: 'Prayer' },
    { name: 'meditation', label: 'Meditation' },
  ],
  colors: ['#10B981', '#8B5CF6', '#06B6D4'],
};

export default function Rituals() {
  return (
    <EnhancedDomainTracker title="Daily Rituals" fields={fields} storageKey="rituals" chartConfig={chartConfig} />
  );
}