import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      const teamResponse = await axios.get(`http://localhost:3001/api/teams/${id}`);
      setTeam(teamResponse.data);

      const membersResponse = await axios.get(`http://localhost:3001/api/teams/${id}/members`);
      setMembers(membersResponse.data);

      const projectsResponse = await axios.get(`http://localhost:3001/api/teams/${id}/projects`);
      setProjects(projectsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching team details:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading team details...</div>;
  if (!team) return <div>Team not found</div>;

  return (
    <div className="team-detail">
      <h2 className="text-2xl font-bold mb-4">{team.name}</h2>
      <p className="mb-4">{team.description}</p>
      
      <h3 className="text-xl font-semibold mb-2">Team Members</h3>
      {members.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {members.map(member => (
            <li key={member.id}>{member.name} - {member.role}</li>
          ))}
        </ul>
      ) : (
        <p>No members in this team yet.</p>
      )}

      <h3 className="text-xl font-semibold mb-2">Associated Projects</h3>
      {projects.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {projects.map(project => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`} className="text-blue-500">
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects associated with this team yet.</p>
      )}

      <div className="mt-4">
        <Link to={`/teams/${id}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Edit Team
        </Link>
        <Link to="/teams" className="bg-gray-500 text-white px-4 py-2 rounded">
          Back to Teams
        </Link>
      </div>
    </div>
  );
};

export default TeamDetail;
