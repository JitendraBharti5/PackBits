import React from 'react';
import Navbar from '../components/Navbar';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#03C755] mb-6">About This Project</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-2">🎯 Project Motive</h2>
            <p className="text-gray-300 leading-relaxed">
        PackBits – Personalized Food Insight web-application,

This project is a user-friendly web application that allows users to scan packaged food products and instantly get clear, visual information about the ingredients it contains. The app is designed to make ingredient information more accessible and understandable for everyday users, especially those with dietary restrictions or health concerns.
<br/>
<b>Key Features:</b>
<br/>
<b>Barcode/QR Code Scanning:</b> Users can scan any packaged food product to fetch ingredient details from the database.
<br/>

<b>Simple Visual Interface:</b> Ingredients are displayed with easy-to-understand icons and color-coded indicators (e.g., harmful, moderate, safe).
<br/>

<b>Personalized Feedback:</b> Results are tailored to each user based on their age, allergies, medical conditions, and dietary restrictions, making it highly relevant and safe.
<br/>

<b>Clean and Intuitive UI:</b> Built with a modern and minimal design approach to ensure smooth navigation and ease of use for all age groups            </p>
<br/>
 
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-2">🛠️ Technologies Used</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li><FaCode className="inline text-green-400 mr-2" /> ReactJS & Tailwind CSS (Frontend)</li>
              <li><FaCode className="inline text-green-400 mr-2" /> Node.js & Express.js (Backend)</li>
              <li><FaCode className="inline text-green-400 mr-2" /> MongoDB (Database)</li>
              <li><FaCode className="inline text-green-400 mr-2" /> Axios, Chart.js, Framer Motion etc.</li>
            </ul>
          </section>

          {/* <section>
            <h2 className="text-2xl font-semibold text-white mb-2">🙋‍♂️ About Developer</h2>
            <div className="text-gray-300 space-y-2">
              <p><span className="font-medium text-white">Name:</span> <b>JITENDRA BHARTI</b></p>
              <p>
  <FaEnvelope className="inline text-blue-400 mr-2" />
  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=obharti84@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline text-blue-400"
  >
    obharti84@gmail.com
  </a>
</p>
              <p>
                <FaLinkedin className="inline text-blue-500 mr-2" />
                <a
                  href="https://www.linkedin.com/in/jitendra-bharti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-400"
                >
                  linkedin.com/in/jitendra-bharti
                </a>
              </p>
              <p>
                <FaGithub className="inline text-gray-300 mr-2" />
                <a
                  href="https://github.com/JitendraBharti5?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-400"
                >
                  github.com/JitendraBharti5
                </a>
              </p>
            </div>
          </section> */}
        </motion.div>
      </div>
    </div>
  );
};

export default About;
