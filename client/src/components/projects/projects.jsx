import React, { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Eye,
  Loader,
  Rocket,
  Lightbulb,
  Code,
  CheckCircle,
  BookOpen,
  Link,
} from "lucide-react";
import "./projects.css";

const Projects = () => {
  const PROJECTS_PER_LOAD = 3;
  const API_BASE_URL = import.meta.env.VITE_API_URL;


  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_LOAD);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingFullProject, setLoadingFullProject] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/projects`);

        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewDetails = async (project) => {
    if (project.fullDescription && project.images) {
      setSelectedProject(project);
      setCurrentImageIndex(0);
      return;
    }
    try {
      setLoadingFullProject(true);
      const response = await fetch(`${API_BASE_URL}/projects/${project._id}`);

      if (!response.ok) {
        throw new Error("Failed to load project details");
      }

      const fullProject = await response.json();
      setProjects((prev) =>
        prev.map((p) => (p._id === fullProject._id ? fullProject : p))
      );

      setSelectedProject(fullProject);
      setCurrentImageIndex(0);
    } catch (err) {
      alert("Failed to load project details. Please try again.");
    } finally {
      setLoadingFullProject(false);
    }
  };
  if (loading) {
    return (
      <section className="featured-section" id="projects">
        <div className="featured-container">
          <div className="featured-header">
            <h2 className="featured-title">My Projects</h2>
            <p className="featured-subtitle">
              Explore my latest work and creative solutions
            </p>
          </div>
          <div className="loading-container">
            <Loader size={50} className="loading-spinner" />
            <p className="loading-text">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-section" id="projects">
        <div className="featured-container">
          <div className="featured-header">
            <h2 className="featured-title">My Projects</h2>
            <p className="featured-subtitle">
              Explore my latest work and creative solutions
            </p>
          </div>
          <div className="error-container">
            <div className="error-box">
              <div className="error-header">
                <p className="error-text">Error: Failed to fetch projects.</p>
                <button
                  className="error-close-btn"
                  onClick={() => setError(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="featured-section" id="projects">
        <div className="featured-container">
          <div className="featured-header">
            <h2 className="featured-title">My Projects</h2>
            <p className="featured-subtitle">
              Explore my latest work and creative solutions
            </p>
          </div>

          <div className="featured-grid">
            {projects.slice(0, visibleCount).map((project) => (
              <div key={project._id} className="featured-card">
                <div className="featured-image">
                  <img
                    src={project.img}
                    alt={project.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />

                  <div className="featured-image-overlay">
                    <button
                      className="featured-icon-btn"
                      title="Github Link"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github size={20} />
                    </button>

                    <button
                      className="featured-icon-btn"
                      title="View Details"
                      onClick={() => handleViewDetails(project)}
                      disabled={loadingFullProject}
                    >
                      {loadingFullProject ? (
                        <Loader size={20} className="spinning" />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                    <button
                      className="featured-icon-btn"
                      title="Live Demo"
                      onClick={() => window.open(project.live, "_blank")}
                    >
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>

                <div className="featured-content">
                  <h3 className="featured-card-title">{project.title}</h3>
                  <p className="featured-card-desc">{project.description}</p>

                  <div className="featured-tags">
                    {project.tags &&
                      project.tags.map((tag, i) => (
                        <span key={i} className="featured-tag">
                          {tag}
                        </span>
                      ))}
                  </div>
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="featured-view-btn"
                    disabled={loadingFullProject}
                  >
                    {loadingFullProject ? "Loading..." : "View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {visibleCount < projects.length && (
            <div className="featured-cta">
              <button
                className="featured-btn"
                onClick={() =>
                  setVisibleCount((prev) => prev + PROJECTS_PER_LOAD)
                }
              >
                Load more projects
              </button>
            </div>
          )}
          {visibleCount >= projects.length && projects.length > 0 && (
            <div className="projects-end-text">End of projects</div>
          )}
        </div>
      </section>
      {selectedProject && (
        <div
          className="project-modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <div className="project-modal-header">
              <h3>{selectedProject.title}</h3>
              <button onClick={() => setSelectedProject(null)}>✕</button>
            </div>

            <div className="modal-scrollable">
              <div className="project-slider">
                <img
                  src={selectedProject.images?.[currentImageIndex]}
                  alt="project"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x400?text=Image+Not+Found";
                  }}
                />

                {selectedProject.images &&
                  selectedProject.images.length > 1 && (
                    <>
                      <button
                        className="slider-btn left"
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0
                              ? selectedProject.images.length - 1
                              : prev - 1
                          )
                        }
                      >
                        ‹
                      </button>

                      <button
                        className="slider-btn right"
                        onClick={() =>
                          setCurrentImageIndex(
                            (prev) => (prev + 1) % selectedProject.images.length
                          )
                        }
                      >
                        ›
                      </button>
                    </>
                  )}
              </div>
              <div className="description">
                <h4
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <BookOpen size={18} className="dis-logo" />
                  Description
                </h4>
                <p>{selectedProject.fullDescription}</p>
              </div>
              <div className="project-details-grid">
                <section>
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CheckCircle size={18} className="cir-logo" /> Features
                  </h4>
                  <ul style={{ "--bullet-color": "rgb(1, 255, 1)" }}>
                    {selectedProject.features &&
                      selectedProject.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                  </ul>
                </section>

                <section>
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Code size={18} className="cod-logo" /> Tech Stack
                  </h4>
                  <ul style={{ "--bullet-color": "#6eacfc" }}>
                    {selectedProject.techStack &&
                      selectedProject.techStack.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                  </ul>
                </section>

                <section>
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Lightbulb size={18} className="bra-logo" /> Key Learnings
                  </h4>
                  <ul style={{ "--bullet-color": "#f7df03" }}>
                    {selectedProject.keyLearnings &&
                      selectedProject.keyLearnings.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                  </ul>
                </section>

                <section>
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Rocket size={18} className="roc-logo" /> Future
                    Improvements
                  </h4>
                  <ul style={{ "--bullet-color": "#9b3ffe" }}>
                    {selectedProject.futureImprovements &&
                      selectedProject.futureImprovements.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                  </ul>
                </section>

                <section className="project-links">
                  <h4>
                    <Link size={18} className="plink" /> Project Links
                  </h4>
                  <div className="project-links1">
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={20} className="logo" /> Live Demo
                    </a>
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github size={20} className="logo" /> GitHub Repository
                    </a>
                    <a
                      href={selectedProject.documentation}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <BookOpen size={20} className="logo" /> Documentation
                    </a>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
