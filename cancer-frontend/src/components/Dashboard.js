import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const activeProjects = projects.filter(p => p.status !== 'Completed').length;
    const averageDuration = projects.reduce((sum, p) => sum + (new Date(p.end_date) - new Date(p.start_date)) / (1000 * 60 * 60 * 24), 0) / projects.length;
    const overdueProjects = projects.filter(p => new Date(p.end_date) < new Date() && p.status !== 'Completed').length;
    const completionRate = (projects.filter(p => p.status === 'Completed').length / projects.length) * 100;

    return { activeProjects, averageDuration, overdueProjects, completionRate };
  };

  const prepareChartData = () => {
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    const pillarCounts = projects.reduce((acc, project) => {
      acc[project.parent_pillar] = (acc[project.parent_pillar] || 0) + 1;
      return acc;
    }, {});

    return {
      statusData: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
      pillarData: Object.entries(pillarCounts).map(([name, value]) => ({ name, value }))
    };
  };

  if (loading) return <div>Loading dashboard...</div>;

  const stats = calculateStats();
  const chartData = prepareChartData();

  return (
    <div className="dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>{stats.activeProjects}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Duration</CardTitle>
          </CardHeader>
          <CardContent>{stats.averageDuration.toFixed(1)} days</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overdue Projects</CardTitle>
          </CardHeader>
          <CardContent>{stats.overdueProjects}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>{stats.completionRate.toFixed(1)}%</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData.statusData} dataKey="value" nameKey="name" fill="#8884d8" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects by Parent Pillar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.pillarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;