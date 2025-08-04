import DomainTracker from '../components/DomainTracker';

const fields = [
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'earlyWakeUp', label: 'Early Wake-up', type: 'checkbox' },
  { name: 'templeVisit', label: 'Temple Visit', type: 'checkbox' },
  { name: 'walkDistance', label: 'Walk Distance (km)', type: 'number' },
];

const chartConfig = {
  type: 'area',
  fields: [
    { name: 'walkDistance', label: 'Walk Distance (km)' },
  ],
  colors: ['#34d399'],
};

export default function Rituals() {
  return <DomainTracker title="Rituals Domain" fields={fields} storageKey="ritualsData" chartConfig={chartConfig} />;
}