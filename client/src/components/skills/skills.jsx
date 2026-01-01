import { useState, useEffect } from "react";
import { FaReact, FaNodeJs, FaPython, FaAws, FaDatabase, FaGithub, FaDocker, FaGit, FaLinux } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiTailwindcss,
  SiRedux,
  SiHtml5,
  SiCss3,
  SiMysql,
  SiExpress,
  SiVisualstudiocode,
  SiPostman,
  SiC,
  SiPython,
  SiSqlite,
  SiCplusplus,
  SiRedis,
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
      { name: "TypeScript", icon: <SiTypescript />, category: "frontend" },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, category: "frontend" },
      { name: "Redux", icon: <SiRedux />, category: "frontend" },
      { name: "CSS3", icon: <SiCss3 />, category: "frontend" },
      { name: "HTML5", icon: <SiHtml5 />, category: "frontend" },
    ],
    backend: [
      { name: "Node.js", icon: <FaNodeJs />, category: "backend" },
      { name: "Express", icon: <SiExpress />, category: "backend" },
      { name: "MongoDB", icon: <SiMongodb />, category: "backend" },
      { name: "MySQL", icon: <SiMysql />, category: "backend" },
      { name: "Redis", icon: <SiRedis />, category: "backend" },
    ],
    tools: [
      { name: "AWS", icon: <FaAws />, category: "tools" },
      // { name: "Docker", icon: <FaDocker />, category: "tools" },
      { name: "Git", icon: <FaGit />, category: "tools" },
      { name: "GitHub", icon: <FaGithub />, category: "tools" },
      { name: "Postman", icon: <SiPostman />, category: "tools" },
      { name: "Vs Code", icon: <SiVisualstudiocode/>, category: "tools" },
      { name: "Linux(terminal)", icon: <FaLinux />, category: "tools" },
    ],
    programming: [
      { name: "C", icon: <SiC />, category: "programming" },
      { name: "C++", icon: < SiCplusplus />, category: "programming" },
      { name: "JavaScript", icon: <SiJavascript />, category: "programming" },
      // { name: "Python", icon: <SiPython />, category: "programming" },
      { name: "SQL", icon: <SiSqlite/>, category: "programming" },
    ],
  };



  const allSkills = [
    ...skillsData.programming,
    ...skillsData.frontend,
    ...skillsData.backend,
    ...skillsData.tools,
  ];

  const filters = [
    { id: "all", label: "All Skills" },
    { id: "programming", label: "Programming Languages" },
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
            Core technologies and tools leveraged to build scalable, efficient, and impactful solutions.
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

      </div>
    </section>
  );
}
