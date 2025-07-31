        // frontend/src/Pages/AdPage.jsx
        import React from 'react';
        import Ad from '../Components/Ad';

        const AdPage = () => {
          return (
            <div className="container mx-auto px-4 py-8">
              {/* The Ad section, now on its own dedicated page */}
              <Ad />
            </div>
          );
        };

        export default AdPage;
        