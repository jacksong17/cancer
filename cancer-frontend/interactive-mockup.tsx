import React, { useState } from 'react';

// Simplified UI components
const Button = ({ children, isActive, onClick }) => (
  <button
    className={`px-4 py-2 mr-2 ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="border rounded-lg shadow-sm p-4 flex-1">{children}</div>
);

const Input = (props) => (
  <input
    {...props}
    className="border rounded px-2 py-1 w-full"
  />
);

const Select = ({ children }) => (
  <select className="border rounded px-2 py-1 w-full">
    {children}
  </select>
);

// Mock data
const mockProjects = [
  { id: 1, name: 'Project A', status: 'In Progress', owner: 'John Doe', startDate: '2024-01-01', endDate: '2024-06-30', progress: 50, parentPillar: 'Operational Reporting' },
  { id: 2, name: 'Project B', status: 'Not Started', owner: 'Jane Smith', startDate: '2024-03-15', endDate: '2024-09-30', progress: 0, parentPillar: 'Executive Reporting' },
  { id: 3, name: 'Project C', status: 'Completed', owner: 'Bob Johnson', startDate: '2023-11-01', endDate: '2024-02-28', progress: 100, parentPillar: 'Operational Reporting' },
];

// Components
const Dashboard = () => {
  const statusCounts = {
    'Not Started': mockProjects.filter(p => p.status === 'Not Started').length,
    'In Progress': mockProjects.filter(p => p.status === 'In Progress').length,
    'Completed': mockProjects.filter(p => p.status === 'Completed').length,
  };

  return (
    <div className="flex gap-4 mb-4">
      <Card>
        <h3 className="font-bold mb-2">Project Status</h3>
        <div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex justify-between">
              <span>{status}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-bold mb-2">Upcoming Deadlines</h3>
        <ul>
          {mockProjects.map(project => (
            <li key={project.id}>{project.name} - {project.endDate}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h3 className="font-bold mb-2">Quick Stats</h3>
        <p>Total Projects: {mockProjects.length}</p>
        <p>Average Progress: {(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length).toFixed(2)}%</p>
      </Card>
    </div>
  );
};

const ProjectList = () => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input placeholder="Search projects..." className="max-w-sm" />
        <Select>
          <option value="all">All Statuses</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Status</th>
            <th className="text-left">Owner</th>
            <th className="text-left">Start Date</th>
            <th className="text-left">End Date</th>
            <th className="text-left">Progress</th>
          </tr>
        </thead>
        <tbody>
          {mockProjects.map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.status}</td>
              <td>{project.owner}</td>
              <td>{project.startDate}</td>
              <td>{project.endDate}</td>
              <td>{project.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GanttChart = () => {
  return (
    <div className="h-[400px] bg-gray-100 flex items-center justify-center">
      <p>Gantt Chart Placeholder</p>
    </div>
  );
};

const ProjectForm = () => {
  return (
    <form className="space-y-4">
      <Input placeholder="Project Name" />
      <Select>
        <option value="">Select Parent Pillar</option>
        <option value="operational">Operational Reporting</option>
        <option value="executive">Executive Reporting</option>
      </Select>
      <Input placeholder="Requestor" />
      <Input type="date" placeholder="Start Date" />
      <Input type="date" placeholder="End Date" />
      <Button>Submit Project</Button>
    </form>
  );
};

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'current-projects':
        return <ProjectList />;
      case 'gantt':
        return <GanttChart />;
      case 'new-project':
        return <ProjectForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cogito IS - Internal Projects</h1>
      <div className="mb-4">
        <Button isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')}>Dashboard</Button>
        <Button isActive={activeView === 'new-project'} onClick={() => setActiveView('new-project')}>New Project</Button>
        <Button isActive={activeView === 'current-projects'} onClick={() => setActiveView('current-projects')}>Current Projects</Button>
        <Button isActive={activeView === 'gantt'} onClick={() => setActiveView('gantt')}>Gantt Chart</Button>
      </div>
      {renderActiveView()}
    </div>
  );
};

export default App;
