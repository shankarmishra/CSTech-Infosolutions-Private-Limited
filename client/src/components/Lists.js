import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUpload, FiFileText, FiDownload, FiEye, FiX } from 'react-icons/fi';
import Loading from './Loading';

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [uploadDetails, setUploadDetails] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await axios.get('/api/lists');
      setLists(res.data.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      toast.error('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error('Please select a valid CSV, XLSX, or XLS file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(res.data.message);
      fetchLists();
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleViewUpload = async (uploadId) => {
    try {
      const res = await axios.get(`/api/lists/upload/${uploadId}`);
      setUploadDetails(res.data.data);
      setSelectedUpload(uploadId);
    } catch (error) {
      toast.error('Failed to load upload details');
    }
  };

  const closeUploadDetails = () => {
    setSelectedUpload(null);
    setUploadDetails(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
          Lists Management
        </h1>
        <p style={{ color: '#6b7280' }}>
          Upload CSV/Excel files and distribute data among agents
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Upload File</h2>
        </div>
        
        <div
          className="upload-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            {uploading ? 'Uploading...' : 'Drag and drop a file here, or click to select'}
          </div>
          <div className="upload-hint">
            Supported formats: CSV, XLSX, XLS (Max 5MB)
          </div>
          <div className="upload-hint">
            Required columns: FirstName, Phone, Notes
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Upload History ({lists.length})</h2>
        </div>
        
        {lists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No uploads found. Upload your first file to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Upload ID</th>
                  <th>Date</th>
                  <th>Total Records</th>
                  <th>Agents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lists.map((upload) => (
                  <tr key={upload.uploadId}>
                    <td>
                      <code style={{ fontSize: '0.75rem' }}>
                        {upload.uploadId.substring(0, 8)}...
                      </code>
                    </td>
                    <td>{new Date(upload.uploadDate).toLocaleString()}</td>
                    <td>{upload.totalRecords}</td>
                    <td>{Object.keys(upload.agents).length}</td>
                    <td>
                      <button
                        onClick={() => handleViewUpload(upload.uploadId)}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <FiEye style={{ marginRight: '0.25rem' }} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Details Modal */}
      {selectedUpload && uploadDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ 
            maxWidth: '800px', 
            width: '100%', 
            maxHeight: '80vh', 
            overflow: 'auto' 
          }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card-title">Upload Details</h2>
              <button onClick={closeUploadDetails} className="btn btn-secondary">
                <FiX />
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Upload ID:</strong> {uploadDetails.uploadId}</p>
              <p><strong>Date:</strong> {new Date(uploadDetails.uploadDate).toLocaleString()}</p>
              <p><strong>Total Records:</strong> {uploadDetails.totalRecords}</p>
              <p><strong>Agents:</strong> {Object.keys(uploadDetails.agents).length}</p>
            </div>

            {Object.entries(uploadDetails.agents).map(([agentId, agentData]) => (
              <div key={agentId} className="card" style={{ marginBottom: '1rem' }}>
                <div className="card-header">
                  <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>
                    {agentData.agentName} ({agentData.records.length} records)
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    {agentData.agentEmail}
                  </p>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Phone</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentData.records.map((record, index) => (
                        <tr key={index}>
                          <td>{record.firstName}</td>
                          <td>{record.phone}</td>
                          <td>{record.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists; 