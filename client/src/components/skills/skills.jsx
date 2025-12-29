import { useState, useEffect } from "react";
import { FaReact, FaNodeJs, FaPython, FaAws, FaDatabase, FaGithub, FaDocker } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiMongodb,
  SiPostgresql,
} from "react-icons/si";
import "./skills.css";

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSkillsVisible, setIsSkillsVisible] = useState(false);


  useEffect(() => {
    const skillsSection = document.getElementById("skills");

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSkillsVisible(entry.isIntersecting);
        // You can dispatch an action here to update navbar
        if (entry.isIntersecting) {
          // Update navbar active state
          document.querySelectorAll(".navbar-link").forEach((link) => {
            link.classList.remove("navbar-link-active");
          });
          const skillsNavLink = document.querySelector('a[href="#skills"]');
          if (skillsNavLink) {
            skillsNavLink.classList.add("navbar-link-active");
          }
        }
      },
      { threshold: 0.3 } // Triggers when 30% of section is visible
    );

    if (skillsSection) {
      observer.observe(skillsSection);
    }

    return () => {
      if (skillsSection) {
        observer.unobserve(skillsSection);
      }
    };
  }, []);

  const skillsData = {
    frontend: [
      { name: "React", icon: <FaReact />, category: "frontend" },
      { name: "JavaScript", icon: <SiJavascript />, category: "frontend" },
      { name: "TypeScript", icon: <SiTypescript />, category: "frontend" },
      { name: "Next.js", icon: <SiNextdotjs />, category: "frontend" },
    ],
    backend: [
      { name: "Node.js", icon: <FaNodeJs />, category: "backend" },
      { name: "Python", icon: <FaPython />, category: "backend" },
      { name: "MongoDB", icon: <SiMongodb />, category: "backend" },
      { name: "PostgreSQL", icon: <SiPostgresql />, category: "backend" },
    ],
    tools: [
      { name: "AWS", icon: <FaAws />, category: "tools" },
      { name: "Docker", icon: <FaDocker />, category: "tools" },
      { name: "Database Design", icon: <FaDatabase />, category: "tools" },
      { name: "GitHub", icon: <FaGithub />, category: "tools" },
    ],
  };

  const otherSkills = [
    "Git",
    "REST APIs",
    "GraphQL",
    "Jest",
    "CI/CD",
    "Agile/Scrum",
    "UI/UX Design",
    "System Design",
  ];

  const allSkills = [
    ...skillsData.frontend,
    ...skillsData.backend,
    ...skillsData.tools,
  ];

  const filters = [
    { id: "all", label: "All Skills" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "tools", label: "Tools & DevOps" },
  ];

  const displayedSkills =
    activeFilter === "all"
      ? allSkills
      : allSkills.filter((skill) => skill.category === activeFilter);

  return (
    <section className="skills-wrapper" id="skills">
      <div className="skills-container">
        {/* Header */}
        <div className="skills-header">
          <h2 className="skills-title">Skills & Technologies</h2>
          <p className="skills-intro">
            Technologies and tools I use to build scalable and impactful solutions
          </p>
        </div>

        {/* Filters */}
        <div className="skills-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {displayedSkills.map((skill) => (
            <div key={skill.name} className="skills-card">
              <div className="skills-icon">{skill.icon}</div>
              <div className="skills-content">
                <h3 className="skills-name">{skill.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Other Skills */}
        <div className="other-skills">
          <h3 className="other-skills-title">Other Expertise</h3>
          <div className="other-skills-list">
            {otherSkills.map((skill) => (
              <span key={skill} className="other-skill-item">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
