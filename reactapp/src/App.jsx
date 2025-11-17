import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const BASE_URL = "http://localhost:30072/course";

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    faculty: "",
    credits: ""
  });

  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const loadCourses = async () => {
    const res = await fetch(`${BASE_URL}/viewall`);
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const addCourse = async () => {
    await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse)
    });

    alert("Course Added!");
    setNewCourse({ title: "", faculty: "", credits: "" });
    loadCourses();
  };

  const searchCourse = async () => {
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
    } catch (error) {
      setSearchResult("NOT_FOUND");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Course Management</h1>

      {/* Add Course */}
      <div className="card">
        <h2>Add Course</h2>

        <input
          type="text"
          placeholder="Course Title"
          className="input"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Faculty Name"
          className="input"
          value={newCourse.faculty}
          onChange={(e) => setNewCourse({ ...newCourse, faculty: e.target.value })}
        />

        <input
          type="number"
          placeholder="Credits"
          className="input"
          value={newCourse.credits}
          onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
        />

        <button className="btn" onClick={addCourse}>Add Course</button>
      </div>

      {/* View All */}
      <div className="card">
        <h2>All Courses</h2>
        <button className="btn" onClick={loadCourses}>Refresh</button>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Faculty</th>
              <th>Credits</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.faculty}</td>
                <td>{c.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Search */}
      <div className="card">
        <h2>Search Course by ID</h2>

        <input
          type="number"
          placeholder="Enter Course ID"
          className="input"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button className="btn" onClick={searchCourse}>Search</button>

        {searchResult && (
          <div className="search-box">
            <h3>Search Result:</h3>

            {searchResult === "NOT_FOUND" ? (
              <p className="error-text">⚠️ Record Not Found</p>
            ) : (
              <ul>
                <li>ID: {searchResult.id}</li>
                <li>Title: {searchResult.title}</li>
                <li>Faculty: {searchResult.faculty}</li>
                <li>Credits: {searchResult.credits}</li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
