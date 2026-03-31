const fs = require('fs');
const path = require('path');
const student = ['sessions', 'workshops', 'resources', 'study-buddy', 'portfolio', 'settings'];
const volunteer = ['students', 'sessions', 'workshops', 'create-workshop', 'resource-studio', 'ai-tools', 'impact', 'settings'];
const admin = ['students', 'volunteers', 'assignments', 'workshops', 'analytics', 'at-risk', 'call-logs', 'reports', 'settings'];

const createPage = (role, slug) => {
  const dir = path.join('app', 'dashboard', role, slug);
  fs.mkdirSync(dir, { recursive: true });
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const content = 'export default function ' + title.replace(/ /g, '') + 'Page() { return (<div className="p-6"> <h1 className="text-2xl font-bold mb-4">' + title + '</h1> <p className="text-slate-600">This section is under construction.</p> </div>); }';
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
};

student.forEach(s => createPage('student', s));
volunteer.forEach(v => createPage('volunteer', v));
admin.forEach(a => createPage('admin', a));
console.log('Done scaffolding!');
