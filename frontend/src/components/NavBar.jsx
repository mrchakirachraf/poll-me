import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./componentsStyles/NavBar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("id_user");

        // Redirect to the home page
        navigate("/");
      } else {
        console.error("Logout failed", await response.json());
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img className="w-full h-full" src="src/assets/DeepTale PollMe.png" alt="" />
      </div>
      <div className={styles.navLinks}>
        <Link to="/home-page" className={styles.navItem}>Home</Link>
        <Link to={`/sondages/user/${localStorage.getItem("id_user")}`} className={styles.navItem}>My Account</Link>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.hamburger} onClick={toggleSidebar}>
        {/* Hamburger Icon */}
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
      <div className={`${styles.sidebar} ${isOpen ? styles.show : ""}`}>
        <Link to="/home-page" className={styles.navItem} onClick={toggleSidebar}>Home</Link>
        <Link to={`/sondages/user/${localStorage.getItem("id_user")}`} className={styles.navItem} onClick={toggleSidebar}>My Account</Link>
        <button className={styles.logoutBtn} onClick={() => { toggleSidebar(); handleLogout(); }}>Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
