import React, { useEffect, useState, useCallback } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  const loadWorkouts = useCallback(() => {
    setLoading(true);
    console.log('Workouts endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Workouts fetched data:', data);
        const payload = data?.results ?? data;
        setWorkouts(Array.isArray(payload) ? payload : [payload]);
      })
      .catch((fetchError) => {
        console.error('Workouts fetch error:', fetchError);
        setError(fetchError);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const filteredWorkouts = workouts.filter((workout) =>
    JSON.stringify(workout).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="card card-custom mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Workouts</h2>
          <div>
            <button className="btn btn-sm btn-primary me-2" onClick={loadWorkouts}>
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
                placeholder="Search workouts"
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
          {error && <div className="alert alert-danger">Error loading workouts.</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-custom mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((workout, index) => (
                  <tr key={workout.id ?? index}>
                    <td>{workout.id ?? index}</td>
                    <td>{workout.name}</td>
                    <td>{workout.description}</td>
                  </tr>
                ))}
                {!filteredWorkouts.length && !loading && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      No workouts found.
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
                <h5 className="modal-title">Workouts Endpoint</h5>
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

export default Workouts;
