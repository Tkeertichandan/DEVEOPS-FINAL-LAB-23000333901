import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const BASE_URL = "http://localhost:30072/applicant";

  const [applicants, setApplicants] = useState([]);
  const [newApplicant, setNewApplicant] = useState({
    name: "",
    email: "",
    position: ""
  });

  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Load Applicants
  const loadApplicants = async () => {
    const res = await fetch(`${BASE_URL}/viewall`);
    const data = await res.json();
    setApplicants(data);
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  // Add Applicant
  const addApplicant = async () => {
    await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApplicant)
    });

    alert("Applicant Added!");
    setNewApplicant({ name: "", email: "", position: "" });
    loadApplicants();
  };

  // Search
  const searchApplicant = async () => {
    try {
      const res = await fetch(`${BASE_URL}/search/${searchId}`);

      if (!res.ok) {
        setSearchResult("NOT_FOUND");
        return;
      }

      const data = await res.json();

      if (!data || Object.keys(data).length === 0) {
        setSearchResult("NOT_FOUND");
      } else {
        setSearchResult(data);
      }
    } catch (err) {
      setSearchResult("NOT_FOUND");
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="header">Job Applicant Management</h1>

      {/* Add Applicant */}
      <div className="glass-card">
        <h2 className="section-title">Add New Applicant</h2>

        <input
          className="field"
          type="text"
          placeholder="Full Name"
          value={newApplicant.name}
          onChange={(e) =>
            setNewApplicant({ ...newApplicant, name: e.target.value })
          }
        />

        <input
          className="field"
          type="email"
          placeholder="Email Address"
          value={newApplicant.email}
          onChange={(e) =>
            setNewApplicant({ ...newApplicant, email: e.target.value })
          }
        />

        <input
          className="field"
          type="text"
          placeholder="Position Applied"
          value={newApplicant.position}
          onChange={(e) =>
            setNewApplicant({ ...newApplicant, position: e.target.value })
          }
        />

        <button className="primary-btn" onClick={addApplicant}>
          Add Applicant
        </button>
      </div>

      {/* View Applicants */}
      <div className="glass-card">
        <div className="flex-header">
          <h2 className="section-title">All Applicants</h2>
          <button className="secondary-btn" onClick={loadApplicants}>
            Refresh
          </button>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Search Applicant */}
      <div className="glass-card">
        <h2 className="section-title">Search Applicant</h2>

        <div className="search-row">
          <input
            className="field"
            type="number"
            placeholder="Enter ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <button className="primary-btn" onClick={searchApplicant}>
            Search
          </button>
        </div>

        {searchResult && (
          <div className="result-box">
            <h3>Search Result:</h3>

            {searchResult === "NOT_FOUND" ? (
              <p className="error-msg">❌ Applicant Not Found</p>
            ) : (
              <ul>
                <li><b>ID:</b> {searchResult.id}</li>
                <li><b>Name:</b> {searchResult.name}</li>
                <li><b>Email:</b> {searchResult.email}</li>
                <li><b>Position:</b> {searchResult.position}</li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;