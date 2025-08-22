import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import Loading from './Loading';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get('/api/agents');
      setAgents(res.data.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      password: ''
    });
    setEditingAgent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.mobileNumber || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingAgent) {
        // Update agent
        await axios.put(`/api/agents/${editingAgent._id}`, {
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber
        });
        toast.success('Agent updated successfully');
      } else {
        // Create agent
        await axios.post('/api/agents', formData);
        toast.success('Agent created successfully');
      }
      
      resetForm();
      fetchAgents();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      mobileNumber: agent.mobileNumber,
      password: ''
    });
    setShowForm(true);
  };

  const handleDelete = async (agentId) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      await axios.delete(`/api/agents/${agentId}`);
      toast.success('Agent deleted successfully');
      fetchAgents();
    } catch (error) {
      toast.error('Failed to delete agent');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            Agents Management
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage your agents and their information
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <FiPlus style={{ marginRight: '0.5rem' }} />
          Add Agent
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2 className="card-title">
              {editingAgent ? 'Edit Agent' : 'Add New Agent'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter agent name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter agent email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (with country code)</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {editingAgent ? 'New Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter password"
                  required={!editingAgent}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-success">
                <FiSave style={{ marginRight: '0.5rem' }} />
                {editingAgent ? 'Update Agent' : 'Create Agent'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                <FiX style={{ marginRight: '0.5rem' }} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Agents ({agents.length})</h2>
        </div>
        
        {agents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No agents found. Add your first agent to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.mobileNumber}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: agent.isActive ? '#d1fae5' : '#fee2e2',
                        color: agent.isActive ? '#065f46' : '#991b1b'
                      }}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(agent)}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(agent._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents; 