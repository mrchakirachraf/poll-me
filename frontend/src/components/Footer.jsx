import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import styles from "./componentsStyles/Footer.module.css"

const Footer = () => {
  return (
    <footer className="bg-[#0A6464] text-center text-white py-6 w-full">
      <p className="font-semibold mb-4">Follow us</p>

      <div className={`${styles.socials} flex justify-center space-x-10`}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          <i className="fab fa-facebook text-2xl"></i>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          <i className="fab fa-instagram text-2xl"></i>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          <i className="fab fa-twitter text-2xl"></i>
        </a>
      </div>

      <hr className="w-full border-t border-white mt-5" />

      <p className="mt-4 text-sm">pollMe@gmail.com</p>
    </footer>
  );
};

export default Footer;
