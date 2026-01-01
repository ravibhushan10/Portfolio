import { useState } from "react";
import { FaPaperPlane,FaEnvelope,FaPhone,FaMapMarkerAlt,FaUser,FaTag,FaCheckCircle,FaExclamationCircle,FaTimes,}
from "react-icons/fa";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showStatusMessage = (type, message) => {
    setStatus({ type, message });
    setShowStatus(true);

    const timeout = type === "success" ? 5000 : 7000;
    setTimeout(() => {
      setShowStatus(false);
    }, timeout);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      showStatusMessage("error", "Please fill all required fields");
      setLoading(false);
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showStatusMessage("error", "Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {

      const API_URL =  import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          throw new Error(firstError);
        }
        throw new Error(data.message || `Submission failed`);
      }

      showStatusMessage("success", "Message sent successfully! I'll get back to you soon.");


      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Error details:", err);


      let errorMessage = err.message;

      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Cannot connect to server.";
      } else if (err.message.includes("NetworkError")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      showStatusMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeStatusModal = () => {
    setShowStatus(false);
  };

  return (
    <>
      {/* Status Modal Overlay */}
      {showStatus && (
        <div className="status-overlay" onClick={closeStatusModal}>
          <div
            className={`status-modal ${status.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="status-close-btn" onClick={closeStatusModal}>
              <FaTimes />
            </button>

            <div className="status-icon">
              {status.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaExclamationCircle />
              )}
            </div>

            <h3 className="status-title">
              {status.type === "success" ? "Success!" : "Error!"}
            </h3>

            <p className="status-message">{status.message}</p>

            <div className="status-actions">
              <button
                className="status-ok-btn"
                onClick={closeStatusModal}
                autoFocus
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="contact section-bg" id="contact">
        <div className="section-content">
          <div className="contact__container">
            <div className="contact__header">
              <h2 className="contact__title">Get In Touch</h2>
              <p className="contact__intro">
                Have questions about my work or want to discuss a project? I’m always open to meaningful collaboration.
              </p>
            </div>

            <div className="contact__wrapper">
              <div className="contact__info">
                <a
                  href="mailto:ravibhushankumar87tp@gmail.com"
                  className="contact__info-card"
                >
                  <div className="contact__info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact__info-content">
                    <h3 className="contact__info-title">Email</h3>
                    <p className="contact__info-text">
                      ravibhushankumar87tp@gmail.com
                    </p>
                    <p className="contact__info-subtext">
                      Typically replies within 24 hours
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+919199519751"
                  className="contact__info-card"
                >
                  <div className="contact__info-icon">
                    <FaPhone />
                  </div>
                  <div className="contact__info-content">
                    <h3 className="contact__info-title">Phone</h3>
                    <p className="contact__info-text">
                      +91 9199519751
                    </p>
                    <p className="contact__info-subtext">
                      Mon-Fri from 9am to 6pm
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Bihar,Muzaffarpur,Muzaffarpur Park+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__info-card"
                >
                  <div className="contact__info-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact__info-content">
                    <h3 className="contact__info-title">Location</h3>
                    <p className="contact__info-text">
                      Muzaffarpur, Bihar, India
                    </p>
                    <p className="contact__info-subtext">
                      Available for remote work worldwide
                    </p>
                  </div>
                </a>
              </div>

              <div className="contact__form-section">
                <form className="contact__form" onSubmit={handleSubmit}>
                  <div className="form__row">
                    <div className="form__group">
                      <label htmlFor="fullName" className="form__label">
                        Full Name <span className="required">*</span>
                      </label>
                      <div className="input-box">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="form__input"
                        />
                      </div>
                    </div>

                    <div className="form__group">
                      <label htmlFor="email" className="form__label">
                        Email Address <span className="required">*</span>
                      </label>
                      <div className="input-box">
                        <FaEnvelope className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="form__input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form__row">
                    <div className="form__group">
                      <label htmlFor="phone" className="form__label">
                        Phone Number
                      </label>
                      <div className="input-box">
                        <FaPhone className="input-icon" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="Enter phone number (optional)"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={loading}
                          className="form__input"
                        />
                      </div>
                    </div>

                    <div className="form__group">
                      <label htmlFor="subject" className="form__label">
                        Subject <span className="required">*</span>
                      </label>
                      <div className="input-box">
                        <FaTag className="input-icon" />
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="form__input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form__group full-width">
                    <label htmlFor="message" className="form__label">
                      Message <span className="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="form__textarea"
                    ></textarea>
                  </div>

                  <div className="form__submit">
                    <button
                      type="submit"
                      className="contact__submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span>Sending...</span>
                          <div className="contact__spinner"></div>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <FaPaperPlane className="contact__submit-icon" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
