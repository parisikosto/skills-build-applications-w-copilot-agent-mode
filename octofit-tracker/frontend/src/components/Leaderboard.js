import React, { useEffect, useState, useCallback } from 'react';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  const loadLeaderboard = useCallback(() => {
    setLoading(true);
    console.log('Leaderboard endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Leaderboard fetched data:', data);
        const payload = data?.results ?? data;
        setEntries(Array.isArray(payload) ? payload : [payload]);
      })
      .catch((fetchError) => {
        console.error('Leaderboard fetch error:', fetchError);
        setError(fetchError);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const filteredEntries = entries.filter((entry) =>
    JSON.stringify(entry).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="card card-custom mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Leaderboard</h2>
          <div>
            <button className="btn btn-sm btn-primary me-2" onClick={loadLeaderboard}>
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
                placeholder="Search leaderboard"
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
          {error && <div className="alert alert-danger">Error loading leaderboard.</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-custom mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr key={entry.id ?? index}>
                    <td>{entry.id ?? index}</td>
                    <td>{entry.user || 'N/A'}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
                {!filteredEntries.length && !loading && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      No leaderboard entries found.
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
                <h5 className="modal-title">Leaderboard Endpoint</h5>
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

export default Leaderboard;
