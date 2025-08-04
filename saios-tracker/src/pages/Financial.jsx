import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'income', label: 'Income (₹)', type: 'number', placeholder: '50000' },
  { name: 'expense', label: 'Expense (₹)', type: 'number', placeholder: '15000' },
  { name: 'savings', label: 'Savings (₹)', type: 'number', placeholder: '10000' },
  { name: 'category', label: 'Category', type: 'select', options: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Investment', 'Other'] },
  { name: 'investment', label: 'Investment Amount (₹)', type: 'number', placeholder: '5000' },
];

const chartConfig = {
  fields: [
    { name: 'income', label: 'Income' },
    { name: 'expense', label: 'Expense' },
    { name: 'savings', label: 'Savings' },
  ],
  colors: ['#10B981', '#EF4444', '#3B82F6'],
};

export default function Financial() {
  return (
    <EnhancedDomainTracker
      title="Finance Tracker"
      fields={fields}
      storageKey="finance-entries"
      chartConfig={chartConfig}
    />
  );
}