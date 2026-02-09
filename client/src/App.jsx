import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/home/home";
import About from "./components/about/about";
import Skills from "./components/skills/skills";
import Projects from "./components/projects/projects";
import Contact from "./components/contact/contact";
import Footer from "./components/footer/footer";
import Navbar from "./components/navbar/navbar";
import "./App.css";

function App() {
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerHeight = document.querySelector(".header")?.clientHeight || 0;
      const navbarHeight =
        document.querySelector(".navbar")?.clientHeight || 70;

      document.documentElement.style.setProperty(
        "--header-height",
        `${headerHeight}px`
      );
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbarHeight}px`
      );
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      if (e.target.tagName === "A") {
        const href = e.target.getAttribute("href");

        if (href && href.startsWith("#")) {
          e.preventDefault();
          const element = document.getElementById(href.substring(1));

          if (element) {
            const navbarHeight =
              document.querySelector(".navbar")?.clientHeight || 70;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "skills", "contact"];
      const navbarHeight =
        document.querySelector(".navbar")?.clientHeight || 70;
      const scrollPosition = window.scrollY + navbarHeight + 100;

      for (const section of sections) {
        const element = document.getElementById(section);

        if (element) {
          const { offsetTop, offsetHeight } = element;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            document.querySelectorAll(".navbar__link").forEach((link) => {
              link.classList.remove("active");
            });

            const activeLink = document.querySelector(
              `.navbar__link[data-section="${section}"]`
            );

            if (activeLink) {
              activeLink.classList.add("active");
            }

            if (history.pushState) {
              history.pushState(null, null, `#${section}`);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <main className="main-content">
                <Navbar />
                <Hero />
                <About/>
                <Projects />
                <Skills />
                <Contact />
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
