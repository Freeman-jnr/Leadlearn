const fs = require('fs');
const path = require('path');

const routes = ['classes', 'live-sessions', 'recorded-lessons', 'students', 'assignments', 'assessments', 'earnings', 'marketplace', 'messages', 'calendar', 'reviews'];

routes.forEach(r => {
  const content = `import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tutor/${r}')({
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold capitalize">${r.replace('-', ' ')}</h1>
      <p className="text-muted-foreground mt-4">This page is coming soon.</p>
    </div>
  ),
});
`;
  fs.writeFileSync(path.join(__dirname, `../src/routes/tutor.${r}.tsx`), content);
});
console.log('Routes generated successfully.');
