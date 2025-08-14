import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Units.css';

function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchUnits = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/unit/list', {
        page,
        search,
        limit: 10
      }, config);
      
      if (response.data.status) {
        setUnits(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      alert('Error fetching units');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = { ...formData };
      if (editingUnit) {
        payload.id = editingUnit._id;
      }
      
      const response = await axios.post('http://localhost:5000/api/unit/store', payload, config);
      
      if (response.data.status) {
        alert(response.data.message);
        setShowModal(false);
        setEditingUnit(null);
        setFormData({ name: '', description: '', isActive: true });
        fetchUnits(currentPage, searchTerm);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error saving unit:', error);
      alert('Error saving unit');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      description: unit.description || '',
      isActive: unit.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:5000/api/unit/delete/${id}`, config);
        if (response.data.status) {
          alert(response.data.message);
          fetchUnits(currentPage, searchTerm);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting unit:', error);
        alert('Error deleting unit');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUnits(1, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUnits(page, searchTerm);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <div className="units-container">
      {/* Header */}
      <div className="units-header">
        <div className="header-content">
          <h1>Units Management</h1>
          <p>Manage your business units and categories</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingUnit(null);
            setFormData({ name: '', description: '', isActive: true });
            setShowModal(true);
          }}
        >
          <i className="fas fa-plus"></i>
          Add New Unit
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Units Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="units-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit._id}>
                  <td>{unit.name}</td>
                  <td>{unit.description || '-'}</td>
                  <td>
                    <span className={`status ${unit.isActive ? 'active' : 'inactive'}`}>
                      {unit.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(unit.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(unit)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(unit._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Unit Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter unit name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter unit description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingUnit ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Units; 