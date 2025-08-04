import DomainTracker from '../components/DomainTracker';

const fields = [
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'cigarettes', label: 'Cigarettes (count)', type: 'number' },
  { name: 'pornConsumed', label: 'Porn Consumed', type: 'checkbox' },
  { name: 'screenTime', label: 'Screen Time (hrs)', type: 'number' },
];

const chartConfig = {
  type: 'area',
  fields: [
    { name: 'cigarettes', label: 'Cigarettes' },
    { name: 'screenTime', label: 'Screen Time (hrs)' },
  ],
  colors: ['#f87171', '#60a5fa'],
};

export default function Addiction() {
  return <DomainTracker title="Addiction Domain" fields={fields} storageKey="addictionData" chartConfig={chartConfig} />;
}