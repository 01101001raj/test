import DomainTracker from '../components/DomainTracker';

const fields = [
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'income', label: 'Income (₹)', type: 'number' },
  { name: 'expenseAmount', label: 'Expense Amount (₹)', type: 'number' },
  { name: 'expenseCategory', label: 'Expense Category', type: 'select', options: ['Food', 'Travel', 'Subscription', 'Misc'] },
  { name: 'investmentDone', label: 'Investment Done', type: 'checkbox' },
];

const chartConfig = {
  type: 'bar',
  fields: [
    { name: 'income', label: 'Income (₹)' },
    { name: 'expenseAmount', label: 'Expense (₹)' },
  ],
  colors: ['#34d399', '#f87171'],
};

export default function Financial() {
  return (
    <DomainTracker title="Financial Domain" fields={fields} storageKey="financialData" chartConfig={chartConfig} />
  );
}