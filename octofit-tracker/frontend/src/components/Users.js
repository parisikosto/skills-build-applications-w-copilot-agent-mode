import React, { useEffect, useState, useCallback } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  const loadUsers = useCallback(() => {
    setLoading(true);
    console.log('Users endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Users fetched data:', data);
        const payload = data?.results ?? data;
        setUsers(Array.isArray(payload) ? payload : [payload]);
      })
      .catch((fetchError) => {
        console.error('Users fetch error:', fetchError);
        setError(fetchError);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((user) =>
    JSON.stringify(user).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="card card-custom mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Users</h2>
          <div>
            <button className="btn btn-sm btn-primary me-2" onClick={loadUsers}>
              Refresh
            </button>
            <button className="btn btn-sm btn-info me-2" onClick={() => setShowModal(true)}>
              Info
            </button>
            <a href={endpoint} className="btn btn-sm btn-outline-light api-link" rel="noreferrer" target="_blank">
              API
            </a>
          </div>
        </div>
        <div className="card-body">
          <form className="row g-3 mb-3">
            <div className="col-md-8">
              <input
                type="search"
                className="form-control"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button type="button" className="btn btn-secondary w-100" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            </div>
          </form>
          {error && <div className="alert alert-danger">Error loading users.</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-custom mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id ?? index}>
                    <td>{user.id ?? index}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.team || 'N/A'}</td>
                  </tr>
                ))}
                {!filteredUsers.length && !loading && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Users Endpoint</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>Using endpoint:</p>
                <pre className="small">{endpoint}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
