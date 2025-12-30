import React, { useState, useEffect } from "react";
import { Trash2, Plus, LogOut, Eye, EyeOff, Edit2, LayoutDashboard } from "lucide-react";
import "./admin.css";

const AdminDashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
  console.log(ADMIN_PASSWORD);

  // ==================== STATE ====================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    img: "",
    images: [""],
    tags: [""],
    features: [""],
    techStack: [""],
    keyLearnings: [""],
    futureImprovements: [""],
    github: "",
    documentation: "",
    live: "",
    order: 999 // Added order field
  });

  // ==================== HELPER FUNCTION ====================
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ==================== FETCH PROJECTS ON MOUNT ====================
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  // ==================== LOGIN ====================
  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
      setError("");
    } else {
      setError("❌ Incorrect password. Please try again.");
      setPassword("");
      setTimeout(() => setError(""), 3000);
    }
  };

  // ==================== FETCH PROJECTS ====================
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      showMessage("error", `❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FORM HANDLERS ====================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // ==================== ADD PROJECT ====================
  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.fullDescription) {
      showMessage("error", "❌ Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order) || 999,
          images: formData.images.filter(img => img),
          tags: formData.tags.filter(tag => tag),
          features: formData.features.filter(f => f),
          techStack: formData.techStack.filter(t => t),
          keyLearnings: formData.keyLearnings.filter(k => k),
          futureImprovements: formData.futureImprovements.filter(f => f)
        })
      });

      if (!response.ok) throw new Error("Failed to add project");

      showMessage("success", "✅ Project added successfully!");
      resetForm();
      setActiveTab("list");
      fetchProjects();
    } catch (error) {
      showMessage("error", `❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ==================== UPDATE PROJECT ====================
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (!editingProject._id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/projects/${editingProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order) || 999,
          images: formData.images.filter(img => img),
          tags: formData.tags.filter(tag => tag),
          features: formData.features.filter(f => f),
          techStack: formData.techStack.filter(t => t),
          keyLearnings: formData.keyLearnings.filter(k => k),
          futureImprovements: formData.futureImprovements.filter(f => f)
        })
      });

      if (!response.ok) throw new Error("Failed to update project");

      showMessage("success", "✅ Project updated successfully!");
      resetForm();
      setEditingProject(null);
      setActiveTab("list");
      fetchProjects();
    } catch (error) {
      showMessage("error", `❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ==================== DELETE PROJECT ====================
  const handleDeleteProject = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete project");

        showMessage("success", "✅ Project deleted successfully!");
        fetchProjects();
      } catch (error) {
        showMessage("error", `❌ Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // ==================== EDIT PROJECT ====================
  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription,
      img: project.img,
      images: project.images || [""],
      tags: project.tags || [""],
      features: project.features || [""],
      techStack: project.techStack || [""],
      keyLearnings: project.keyLearnings || [""],
      futureImprovements: project.futureImprovements || [""],
      github: project.github,
      documentation: project.documentation,
      live: project.live,
      order: project.order || 999
    });
    setActiveTab("edit");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      fullDescription: "",
      img: "",
      images: [""],
      tags: [""],
      features: [""],
      techStack: [""],
      keyLearnings: [""],
      futureImprovements: [""],
      github: "",
      documentation: "",
      live: "",
      order: 999
    });
    setEditingProject(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setProjects([]);
    resetForm();
  };

  // ==================== LOGIN PAGE ====================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h1 className="admin-login-title">🔐 Admin Access</h1>
          <p className="admin-login-subtitle">Enter password to manage projects</p>
          {error && <p className="admin-error-text">{error}</p>}

          <form onSubmit={handleLogin} className="admin-form">
            <div className="admin-input-group">
              <label className="admin-label">Password</label>
              <div className="admin-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="admin-input"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-eye-btn"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="admin-login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <header className="admin-header">
        <h1 className="admin-header-title"><LayoutDashboard /> Admin Dashboard</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Message */}
      {message.text && (
        <div className={`admin-message admin-message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => { setActiveTab("list"); resetForm(); }}
          className={`admin-tab ${activeTab === "list" ? "admin-tab-active" : ""}`}
        >
          📋 Projects List
        </button>
        <button
          onClick={() => { setActiveTab("add"); resetForm(); }}
          className={`admin-tab ${activeTab === "add" ? "admin-tab-active" : ""}`}
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {/* LIST TAB */}
        {activeTab === "list" && (
          <div className="admin-tab-content">
            <h2 className="admin-tab-title">All Projects</h2>

            {loading ? (
              <p className="admin-loading-text">Loading...</p>
            ) : projects.length === 0 ? (
              <p className="admin-no-data-text">No projects found</p>
            ) : (
              <div className="admin-projects-list">
                {projects.map(project => (
                  <div key={project._id} className="admin-project-card">
                    <div className="admin-project-info">
                      <h3 className="admin-project-title">
                        {project.title}
                        <span style={{
                          marginLeft: '10px',
                          fontSize: '0.9rem',
                          color: '#666',
                          fontWeight: 'normal'
                        }}>
                          (Order: {project.order || 999})
                        </span>
                      </h3>
                      <p className="admin-project-desc">{project.description}</p>
                    </div>
                    <div className="admin-project-actions">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="admin-edit-btn"
                      >
                        <Edit2 size={18} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id, project.title)}
                        className="admin-delete-btn"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT TAB */}
        {(activeTab === "add" || activeTab === "edit") && (
          <div className="admin-tab-content">
            <h2 className="admin-tab-title">
              {activeTab === "add" ? "Add New Project" : "Edit Project"}
            </h2>

            <form onSubmit={activeTab === "add" ? handleAddProject : handleUpdateProject} className="admin-form">
              {/* Basic Info */}
              <div className="admin-section">
                <h3 className="admin-section-title">Basic Information</h3>

                <div className="admin-form-group">
                  <label className="admin-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Project title"
                    className="admin-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Short Description *</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description"
                    className="admin-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Full Description *</label>
                  <textarea
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed description"
                    className="admin-textarea"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Thumbnail Image URL *</label>
                  <input
                    type="url"
                    name="img"
                    value={formData.img}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.png"
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              {/* Images */}
              <div className="admin-section">
                <h3 className="admin-section-title">Project Images</h3>
                {formData.images.map((image, index) => (
                  <div key={index} className="admin-array-item">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleArrayChange("images", index, e.target.value)}
                      placeholder="Image URL"
                      className="admin-input"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("images", index)}
                        className="admin-remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("images")}
                  className="admin-add-btn"
                >
                  + Add Image
                </button>
              </div>

              {/* Tags */}
              <div className="admin-section">
                <h3 className="admin-section-title">Tags</h3>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="admin-array-item">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                      placeholder="e.g., React"
                      className="admin-input"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("tags", index)}
                        className="admin-remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("tags")}
                  className="admin-add-btn"
                >
                  + Add Tag
                </button>
              </div>

              {/* Features */}
              <div className="admin-section">
                <h3 className="admin-section-title">Features</h3>
                {formData.features.map((feature, index) => (
                  <div key={index} className="admin-array-item">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange("features", index, e.target.value)}
                      placeholder="Feature description"
                      className="admin-input"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("features", index)}
                        className="admin-remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("features")}
                  className="admin-add-btn"
                >
                  + Add Feature
                </button>
              </div>

              {/* Tech Stack */}
              <div className="admin-section">
                <h3 className="admin-section-title">Tech Stack</h3>
                {formData.techStack.map((tech, index) => (
                  <div key={index} className="admin-array-item">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayChange("techStack", index, e.target.value)}
                      placeholder="e.g., React.js"
                      className="admin-input"
                    />
                    {formData.techStack.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("techStack", index)}
                        className="admin-remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("techStack")}
                  className="admin-add-btn"
                >
                  + Add Tech
                </button>
              </div>

              {/* Key Learnings */}
              <div className="admin-section">
                <h3 className="admin-section-title">Key Learnings</h3>
                {formData.keyLearnings.map((learning, index) => (
                  <div key={index} className="admin-array-item">
                    <input
                      type="text"
                      value={learning}
                      onChange={(e) => handleArrayChange("keyLearnings", index, e.target.value)}
                      placeholder="Learning description"
                      className="admin-input"
                    />
                    {formData.keyLearnings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("keyLearnings", index)}
                        className="admin-remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("keyLearnings")}
                  className="admin-add-btn"
                >
                  + Add Learning
                </button>
              </div>

              {/* Future Improvements */}
              <div className="admin-section">
                <h3 className="admin-section-title">Future Improvements</h3>
                {formData.futureImprovements.map((improvement, index) => (
                  <div key={index} className="admin-array-item">
                    <input
                      type="text"
                      value={improvement}
                      onChange={(e) => handleArrayChange("futureImprovements", index, e.target.value)}
                      placeholder="Improvement description"
                      className="admin-input"
                    />
                    {formData.futureImprovements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("futureImprovements", index)}
                        className="admin-remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("futureImprovements")}
                  className="admin-add-btn"
                >
                  + Add Improvement
                </button>
              </div>

              {/* Links */}
              <div className="admin-section">
                <h3 className="admin-section-title">Project Links</h3>

                <div className="admin-form-group">
                  <label className="admin-label">GitHub URL *</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repo"
                    className="admin-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Documentation URL *</label>
                  <input
                    type="url"
                    name="documentation"
                    value={formData.documentation}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="admin-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Live Demo URL *</label>
                  <input
                    type="url"
                    name="live"
                    value={formData.live}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              {/* ORDER SECTION - NEW */}
              <div className="admin-section">
                <h3 className="admin-section-title">Display Order</h3>

                <div className="admin-form-group">
                  <label className="admin-label">Order Position *</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 for first position"
                    className="admin-input"
                    min="1"
                    required
                  />
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    marginTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    Lower numbers appear first (1, 2, 3...). Default is 999 (appears last).
                  </p>
                </div>
              </div>

              <button type="submit" className="admin-submit-btn" disabled={loading}>
                {loading ? "Processing..." : (activeTab === "add" ? "Add Project" : "Update Project")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
