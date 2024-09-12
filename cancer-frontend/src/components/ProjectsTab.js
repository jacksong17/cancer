import React, { useState, useCallback } from 'react';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';

const ProjectsTab = () => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleNewProject = () => {
    setEditingProjectId(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (projectId) => {
    setEditingProjectId(projectId);
    setShowProjectForm(true);
  };

  const handleFormSubmitSuccess = useCallback(() => {
    setShowProjectForm(false);
    setEditingProjectId(null);
    setRefreshList(prev => !prev);
  }, []);

  return (
    <div className="projects-tab">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        {!showProjectForm && (
          <button
            onClick={handleNewProject}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            New Project
          </button>
        )}
      </div>
      
      {showProjectForm ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {editingProjectId ? 'Edit Project' : 'Create New Project'}
          </h3>
          <ProjectForm 
            projectId={editingProjectId}
            onSubmitSuccess={handleFormSubmitSuccess}
          />
          <button
            onClick={() => setShowProjectForm(false)}
            className="mt-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <ProjectList onEditProject={handleEditProject} refreshTrigger={refreshList} />
      )}
    </div>
  );
};

export default ProjectsTab;