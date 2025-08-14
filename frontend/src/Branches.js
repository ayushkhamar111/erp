import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Branches.css';

function Branches() {
  const [branchName, setBranchName] = useState('');
  const [branches, setBranches] = useState([]);

  const fetchBranches = async () => {
    const res = await axios.get('http://localhost:5000/api/branches');
    setBranches(res.data);
  };

  const createBranch = async () => {
    await axios.post('http://localhost:5000/api/branches', { branchName });
    setBranchName('');
    fetchBranches();
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="branches-container">
      {/* Header */}
      <div className="branches-header">
        <div className="header-content">
          <h1>Branches Management</h1>
          <p>Manage your business branches and locations</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <form className="branch-form" onSubmit={(e) => { e.preventDefault(); createBranch(); }}>
          <div className="form-group">
            <label>Branch Name</label>
            <input 
              type="text"
              placeholder="Enter branch name" 
              value={branchName} 
              onChange={e => setBranchName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            <i className="fas fa-plus"></i>
            Add Branch
          </button>
        </form>
      </div>

      {/* Branches Table */}
      <div className="table-container">
        <table className="branches-table">
          <thead>
            <tr>
              <th>Branch Name</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch._id}>
                <td>{branch.branchName}</td>
                <td>{new Date(branch.createdAt || Date.now()).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Branches;
