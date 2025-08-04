import EnhancedDomainTracker from '../components/EnhancedDomainTracker';

const fields = [
  { name: 'income', label: 'Income (₹)', type: 'number', placeholder: '50000' },
  { name: 'expenses', label: 'Expenses (₹)', type: 'number', placeholder: '15000' },
  { name: 'savings', label: 'Savings (₹)', type: 'number', placeholder: '10000' },
  { name: 'investment', label: 'Investment (₹)', type: 'number', placeholder: '5000' },
  { name: 'category', label: 'Category', type: 'select', options: ['Salary', 'Freelance', 'Investment', 'Other'] },
];

const chartConfig = {
  fields: [
    { name: 'income', label: 'Income' },
    { name: 'expenses', label: 'Expenses' },
    { name: 'savings', label: 'Savings' },
  ],
  colors: ['#10B981', '#EF4444', '#3B82F6'],
};

export default function Financial() {
  return (
    <EnhancedDomainTracker title="Financial Health" fields={fields} storageKey="financial" chartConfig={chartConfig} />
  );
}