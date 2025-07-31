// frontend/src/Components/Contact.jsx
import React from 'react';

const Contact = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-[#A4C7E6] px-6 py-10 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl mt-24">
      <div className="w-full max-w-2xl p-10 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-[#1D3557] mb-6">
          Get in Touch
        </h2>
        <p className="mt-4 text-xl text-[#1D3557]/80 leading-relaxed">
          We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out.
        </p>
        <div className="mt-8 space-y-4">
          <p className="text-lg text-[#1D3557]">
            <strong className="font-semibold">Email:</strong>{' '}
            <a href="mailto:info@devsync.com" className="text-[#457B9D] hover:underline transition duration-200">info@devsync.com</a>
          </p>
          <p className="text-lg text-[#1D3557]">
            <strong className="font-semibold">Phone:</strong>{' '}
            <a href="tel:+11234567890" className="text-[#457B9D] hover:underline transition duration-200">+1 (123) 456-7890</a>
          </p>
          <p className="text-lg text-[#1D3557]">
            <strong className="font-semibold">Address:</strong>{' '}
            123 DevSync Lane, Codeville, CA 90210
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;