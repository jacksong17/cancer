import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import Dashboard from './components/Dashboard';
import ProjectsTab from './components/ProjectsTab';
import GanttChart from './components/GanttChart';
import TeamList from './components/TeamList';
import TeamForm from './components/TeamForm';
import TeamDetail from './components/TeamDetail';
import './styles/app.css';
import './styles/ProjectList.css';

const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Cogito IS - Internal Projects</h1>
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>
          <TabsContent value="gantt">
            <GanttChart />
          </TabsContent>
          <TabsContent value="teams">
            <Switch>
              <Route exact path="/teams" component={TeamList} />
              <Route path="/teams/new" component={TeamForm} />
              <Route path="/teams/:id" exact component={TeamDetail} />
              <Route path="/teams/:id/edit" component={TeamForm} />
            </Switch>
          </TabsContent>
        </Tabs>
      </div>
    </Router>
  );
};

export default App;