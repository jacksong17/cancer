const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

const testProjects = [
  {
    name: 'Project A',
    status: 'In Progress',
    owner: 'John Doe',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    progress: 50,
    parent_pillar: 'Operational Reporting'
  },
  {
    name: 'Project B',
    status: 'Not Started',
    owner: 'Jane Smith',
    start_date: '2024-03-15',
    end_date: '2024-09-30',
    progress: 0,
    parent_pillar: 'Executive Reporting'
  },
  {
    name: 'Project C',
    status: 'Completed',
    owner: 'Bob Johnson',
    start_date: '2023-11-01',
    end_date: '2024-02-28',
    progress: 100,
    parent_pillar: 'Operational Reporting'
  }
];

db.serialize(() => {
  const stmt = db.prepare('INSERT INTO projects (name, status, owner, start_date, end_date, progress, parent_pillar) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  testProjects.forEach((project) => {
    stmt.run(Object.values(project));
  });
  
  stmt.finalize();
  
  console.log('Test data has been added to the database.');
  db.close();
});
