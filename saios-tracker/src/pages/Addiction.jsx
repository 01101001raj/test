import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'cigarettes', label: 'Cigarettes', type: 'number', placeholder: '0' },
  { name: 'porn', label: 'Porn (minutes)', type: 'number', placeholder: '0' },
  { name: 'screenTime', label: 'Screen Time (hours)', type: 'number', placeholder: '4' },
  { name: 'alcohol', label: 'Alcohol (units)', type: 'number', placeholder: '0' },
  { name: 'gaming', label: 'Gaming (hours)', type: 'number', placeholder: '0' },
  { name: 'socialMedia', label: 'Social Media (hours)', type: 'number', placeholder: '1' },
];

const chartConfig = {
  fields: [
    { name: 'cigarettes', label: 'Cigarettes' },
    { name: 'screenTime', label: 'Screen Time' },
    { name: 'porn', label: 'Porn' },
  ],
  colors: ['#EF4444', '#F59E0B', '#8B5CF6'],
};

export default function Addiction() {
  return (
    <EnhancedDomainTracker title="Addiction Recovery" fields={fields} storageKey="addiction" chartConfig={chartConfig} />
  );
}