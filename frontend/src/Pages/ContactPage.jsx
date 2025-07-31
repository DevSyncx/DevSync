        // frontend/src/Pages/ContactPage.jsx
        import React from 'react';
        import Contact from '../Components/contact'; // Assuming 'contact' is the correct component name

        const ContactPage = () => {
          return (
            <div className="container mx-auto px-4 py-8">
              {/* The Contact section, now on its own dedicated page */}
              <Contact />
            </div>
          );
        };

        export default ContactPage;
        