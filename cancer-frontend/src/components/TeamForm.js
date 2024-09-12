import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const TeamForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const [team, setTeam] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      fetchTeam();
    }
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/teams/${id}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:3001/api/teams/${id}`, team);
      } else {
        await axios.post('http://localhost:3001/api/teams', team);
      }
      history.push('/teams');
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Team Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={team.name}
          onChange={handleChange}
          required
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">Description</label>
        <textarea
          id="description"
          name="description"
          value={team.description}
          onChange={handleChange}
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {id ? 'Update Team' : 'Create Team'}
      </button>
    </form>
  );
};

export default TeamForm;
