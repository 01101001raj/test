import DomainTracker from '../components/DomainTracker';

const fields = [
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'wakeTime', label: 'Wake Time', type: 'time' },
  { name: 'sleepTime', label: 'Sleep Time', type: 'time' },
  { name: 'cigarettes', label: 'Cigarettes', type: 'number' },
  { name: 'screenTime', label: 'Screen Time (hrs)', type: 'number' },
  { name: 'gym', label: 'Gym', type: 'checkbox' },
  { name: 'workoutDuration', label: 'Workout Duration (min)', type: 'number' },
  { name: 'coldShower', label: 'Cold Shower', type: 'checkbox' },
  { name: 'boxingPracticed', label: 'Boxing Practiced', type: 'checkbox' },
];

const chartConfig = {
  type: 'bar',
  fields: [
    { name: 'screenTime', label: 'Screen Time (hrs)' },
    { name: 'cigarettes', label: 'Cigarettes' },
  ],
  colors: ['#4ade80', '#f87171'],
};

export default function Physical() {
  return (
    <DomainTracker title="Physical Domain" fields={fields} storageKey="physicalData" chartConfig={chartConfig} />
  );
}