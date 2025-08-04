import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'workout', label: 'Workout Type', type: 'select', options: ['Cardio', 'Strength', 'Yoga', 'Running', 'Walking', 'Swimming', 'Other'] },
  { name: 'duration', label: 'Duration (minutes)', type: 'number', placeholder: '30' },
  { name: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70.5' },
  { name: 'water', label: 'Water Intake (L)', type: 'number', placeholder: '2.5' },
  { name: 'steps', label: 'Steps', type: 'number', placeholder: '8000' },
  { name: 'sleep', label: 'Sleep Hours', type: 'number', placeholder: '8' },
];

const chartConfig = {
  fields: [
    { name: 'weight', label: 'Weight' },
    { name: 'water', label: 'Water Intake' },
    { name: 'steps', label: 'Steps' },
  ],
  colors: ['#3B82F6', '#10B981', '#F59E0B'],
};

export default function Physical() {
  return (
    <EnhancedDomainTracker
      title="Physical Health Tracker"
      fields={fields}
      storageKey="physical-entries"
      chartConfig={chartConfig}
    />
  );
}