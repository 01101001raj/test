import DomainTracker from '../components/DomainTracker';

const fields = [
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'entry', label: 'Journal Entry', type: 'text' },
];

export default function Journal() {
  return <DomainTracker title="Journal" fields={fields} storageKey="journalData" />;
}