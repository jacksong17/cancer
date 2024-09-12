import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

const GanttChart = () => {
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

  const prepareChartData = () => {
    const data = [
      [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
      ],
      ...projects.map(project => [
        project.id.toString(),
        project.name,
        new Date(project.start_date),
        new Date(project.end_date),
        null,
        project.progress,
        null
      ])
    ];
    return data;
  };

  if (loading) return <div>Loading Gantt chart...</div>;

  return (
    <div className="gantt-chart">
      <h2 className="text-xl font-semibold mb-4">Project Timeline</h2>
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="Gantt"
        loader={<div>Loading Chart</div>}
        data={prepareChartData()}
        options={{
          height: 400,
          gantt: {
            trackHeight: 30,
          },
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
};

export default GanttChart;