        // frontend/src/Pages/AboutPage.jsx
        import React from 'react';
        import About from '../Components/About';

        const AboutPage = () => {
          return (
            <div className="container mx-auto px-4 py-8">
              {/* The About section, now on its own dedicated page */}
              <About />
            </div>
          );
        };

        export default AboutPage;
        