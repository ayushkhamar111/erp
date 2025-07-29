import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Branches</h2>
      <input placeholder="Branch Name" value={branchName} onChange={e => setBranchName(e.target.value)} />
      <button onClick={createBranch}>Add</button>
      <ul>
        {branches.map(branch => (
          <li key={branch._id}>{branch.branchName}</li>
        ))}
      </ul>
    </div>
  );
}

export default Branches;
