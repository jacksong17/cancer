import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/app.css';

const ProjectCard = ({ project, onEdit, onDelete }) => (
  <div className="project-card">
    <h3>{project.name}</h3>
    <p><strong>Status:</strong> {project.status}</p>
    <p><strong>Owner:</strong> {project.owner}</p>
    <p><strong>Progress:</strong> {project.progress}%</p>
    <div className="project-card-actions">
      <button onClick={() => onEdit(project.id)} className="btn btn-edit">Edit</button>
      <button onClick={() => onDelete(project.id)} className="btn btn-delete">Delete</button>
    </div>
  </div>
);

const ProjectList = ({ onEditProject, refreshTrigger }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:3001/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || project.status === statusFilter)
  );

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="project-list">
      <div className="project-list-header">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="project-grid">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={onEditProject}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;