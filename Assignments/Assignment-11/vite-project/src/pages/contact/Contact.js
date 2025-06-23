import React, { useState, useEffect } from 'react';
import Textarea from '../../components/textarea/Textarea';
import Input from '../../components/input/Input';

export default function Contact() {
  // State to manage form data and validity
  const [formData, setFormData] = useState({ fullname: '', email: '', message: '' });
  const [isFormValid, setIsFormValid] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form whenever formData changes
  useEffect(() => {
    const validateForm = () => {
      const isValid =
        formData.fullname.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.message.trim() !== '';
      setIsFormValid(isValid);
    };

    validateForm();
  }, [formData]);

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    alert('Form submitted successfully!');
  };

  return (
    <article className="contact active" data-page="contact">
      {/* Header Section */}
      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>

      {/* Map Section */}
      <section className="mapbox" data-mapbox>
        <figure>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d199666.5651251294!2d-121.58334177520186!3d38.56165006739519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac672b28397f9%3A0x921f6aaa74197fdb!2sSacramento%2C%20CA%2C%20USA!5e0!3m2!1sen!2sbd!4v1647608789441!5m2!1sen!2sbd"
            width="400"
            height="300"
            loading="lazy"
            title="Google Map"
          ></iframe>
        </figure>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form">
        <h3 className="h3 form-title">Contact Form</h3>

        <form
          action="#"
          className="form"
          data-form
          onSubmit={handleFormSubmit}
        >
          <div className="input-wrapper">
            <Input
            className='form-input'
              type="text"
              name="fullname"
              placeholder="Full name"
              value={formData.fullname}
              onChange={handleInputChange}
              required
              data-form-input
            />
            <Input
            className='form-input'
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              data-form-input
/>
          </div>

          <Textarea
          className='form-input'
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleInputChange}
            required
            data-form-input
          />

          <button
            className="form-btn"
            type="submit"
            disabled={isFormValid} // Button is disabled if form is invalid
            data-form-btn
          >
            <ion-icon name="paper-plane"></ion-icon>
            <span>Send Message</span>
          </button>
        </form>
      </section>
    </article>
  );
}