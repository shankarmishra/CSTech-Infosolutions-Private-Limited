import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUsers, FiFileText, FiUpload, FiPlus, FiRefreshCw } from 'react-icons/fi';
import Loading from './Loading';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    agents: 0,
    lists: 0,
    uploads: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchStats();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);

      // Add a small delay to ensure token is properly set
      await new Promise(resolve => setTimeout(resolve, 500));

      const [agentsRes, listsRes] = await Promise.all([
        axios.get('/api/agents'),
        axios.get('/api/lists')
      ]);

      setStats({
        agents: agentsRes.data.count || 0,
        lists: listsRes.data.count || 0,
        uploads: Object.keys(listsRes.data.data || {}).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(true);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You do not have permission to view this data.');
      } else {
        toast.error('Failed to load dashboard statistics. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchStats();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '4rem',
          color: '#9ca3af',
          marginBottom: '1rem'
        }}>
          📊
        </div>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Unable to Load Statistics
        </h2>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          We couldn't load your dashboard statistics. This might be due to a connection issue or authentication problem.
        </p>
        <button
          onClick={handleRetry}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0 auto'
          }}
        >
          <FiRefreshCw />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>
          Welcome to the MERN Admin Dashboard. Manage your agents and distribute lists efficiently.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <FiUsers style={{ marginRight: '0.5rem' }} />
            Total Agents
          </div>
          <div className="dashboard-card-value">{stats.agents}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Active agents in the system
          </p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <FiFileText style={{ marginRight: '0.5rem' }} />
            Total Records
          </div>
          <div className="dashboard-card-value">{stats.lists}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Distributed records across agents
          </p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <FiUpload style={{ marginRight: '0.5rem' }} />
            Upload Sessions
          </div>
          <div className="dashboard-card-value">{stats.uploads}</div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Total file upload sessions
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/agents" className="btn btn-primary" style={{ textAlign: 'center' }}>
              <FiPlus style={{ marginRight: '0.5rem' }} />
              Add New Agent
            </Link>
            <Link to="/lists" className="btn btn-success" style={{ textAlign: 'center' }}>
              <FiUpload style={{ marginRight: '0.5rem' }} />
              Upload CSV/Excel File
            </Link>
            <Link to="/agents" className="btn btn-secondary" style={{ textAlign: 'center' }}>
              <FiUsers style={{ marginRight: '0.5rem' }} />
              Manage Agents
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">System Information</h2>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <p><strong>Features:</strong></p>
            <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
              <li>Admin authentication with JWT</li>
              <li>Agent management (CRUD operations)</li>
              <li>CSV/Excel file upload and processing</li>
              <li>Automatic distribution to agents</li>
              <li>Real-time dashboard statistics</li>
              <li>Responsive design</li>
            </ul>
            
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
              <p><strong>File Format Requirements:</strong></p>
              <p style={{ marginTop: '0.5rem' }}>
                CSV/Excel files must contain columns: <code>FirstName</code>, <code>Phone</code>, <code>Notes</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 