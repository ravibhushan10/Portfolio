import { TypeAnimation } from "react-type-animation";
import {
  FaDownload,
  FaArrowRight,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { SiLeetcode, SiX } from "react-icons/si";
import "./home.css";

const Hero = () => {
  const handleDownloadCV = () => {
     window.open('https://d1jd6j7xdf8x95.cloudfront.net/images/Ravibhushan_CV.pdf', '_blank');
  };

  return (
    <section className="hero section-bg" id="home">
      <div className="section-content">
        <div className="hero__container">
          <div className="hero__content">
            <div className="hero__greeting">
              <div className="hero__badge">
                <span className="hero__badge-dot"></span>
                Available for work
              </div>

              <h1 className="hero__intro">
                Hi, I'm <span className="hero__name">Ravi Bhushan</span>
              </h1>
            </div>

            <div className="hero__titles">
              <h2 className="hero__title">
                <TypeAnimation
                  sequence={[
                    "Full-Stack Developer",
                    2000,
                    "Software Developer",
                    2000,
                    "Problem Solver",
                    2000,
                    "Tech Enthusiast",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="hero__typewriter"
                />
              </h2>
            </div>

            <p className="hero__description">
              I craft scalable and impactful solutions by solving complex system
              challenges, striving to enhance user experiences. And I love to
              learn new technologies and improve myself.
            </p>

            <div className="hero__buttons">
              <button
                className="hero__btn hero__btn--primary"
                onClick={handleDownloadCV}
                aria-label="Download CV"
              >
                <FaDownload className="hero__btn-icon" />
                Download CV
              </button>

              <a
                href="#projects"
                className="hero__btn hero__btn--secondary"
                aria-label="View my projects"
              >
                Explore My Work
                <FaArrowRight className="hero__btn-icon" />
              </a>
            </div>

            <div className="hero__social">
              <span className="hero__social-label">Follow me</span>

              <div className="hero__social-icons">
                <a
                  href="https://www.linkedin.com/in/ravibhushan-kumar-55b312344/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero__social-link linkedin"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin />
                </a>

                <a
                  href="https://github.com/ravibhushan10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero__social-link github_profile"
                  aria-label="GitHub Profile"
                >
                  <FaGithub />
                </a>

                <a
                  href="https://leetcode.com/u/ravibhushan54321/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero__social-link leetcode"
                  aria-label="LeetCode Profile"
                >
                  <SiLeetcode />
                </a>

                <a
                  href="https://x.com/Ravibhushan_12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero__social-link twitter"
                  aria-label="X (Twitter) Profile"
                >
                  <SiX />
                </a>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__image-wrapper">
              <div className="hero__profile-image-circle">
                <div className="hero__image-inner-circle">
                  <img
                    src="https://d1jd6j7xdf8x95.cloudfront.net/images/profile_image.png"
                    alt="Ravi Bhushan - Full Stack Developer"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
