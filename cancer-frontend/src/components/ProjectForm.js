import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProjectForm.css';

const ProjectForm = ({ projectId, onSubmitSuccess }) => {
  const [project, setProject] = useState({
    name: '',
    description: '',
    status: 'Not Started',
    owner: '',
    start_date: '',
    end_date: '',
    progress: 0,
    parent_pillar: '',
    priority: 1,
    budget: 0,
    department: '',
    manager: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to fetch project details. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = projectId
        ? await axios.put(`http://localhost:3001/api/projects/${projectId}`, project)
        : await axios.post('http://localhost:3001/api/projects', project);
      
      console.log('Server response:', response.data);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Failed to save project. Server error: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Failed to save project. Network error. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Failed to save project. ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="name">Project Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={project.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={project.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={project.status}
          onChange={handleChange}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="owner">Owner</label>
        <input
          type="text"
          id="owner"
          name="owner"
          value={project.owner}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="start_date">Start Date</label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          value={project.start_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="end_date">End Date</label>
        <input
          type="date"
          id="end_date"
          name="end_date"
          value={project.end_date}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="progress">Progress (%)</label>
        <input
          type="number"
          id="progress"
          name="progress"
          value={project.progress}
          onChange={handleChange}
          min="0"
          max="100"
        />
      </div>
      <div className="form-group">
        <label htmlFor="parent_pillar">Parent Pillar</label>
        <input
          type="text"
          id="parent_pillar"
          name="parent_pillar"
          value={project.parent_pillar}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <input
          type="number"
          id="priority"
          name="priority"
          value={project.priority}
          onChange={handleChange}
          min="1"
          max="5"
        />
      </div>
      <div className="form-group">
        <label htmlFor="budget">Budget</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={project.budget}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
      </div>
      <div className="form-group">
        <label htmlFor="department">Department</label>
        <input
          type="text"
          id="department"
          name="department"
          value={project.department}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="manager">Manager</label>
        <input
          type="text"
          id="manager"
          name="manager"
          value={project.manager}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Saving...' : (projectId ? 'Update Project' : 'Create Project')}
      </button>
    </form>
  );
};

export default ProjectForm;