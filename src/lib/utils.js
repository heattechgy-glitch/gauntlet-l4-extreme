export function generateId() {
  return Math.random().toString(16).slice(2, 10);
}

export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export function priorityColor(priority) {
  const colors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    urgent: 'text-red-400'
  };
  return colors[priority] || 'text-gray-400';
}

export function truncate(str, maxLength) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function cn(...args) {
  return args.filter(Boolean).join(' ');
}