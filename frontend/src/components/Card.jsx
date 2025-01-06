import React from "react";
import { Link } from "react-router-dom"; 
import styles from "./componentsStyles/Card.module.css";

const Card = ({ title, description, link}) => {
  return (
    <Link
      to={link} 
      className={`${styles.DeepTale_border} bg-DeepTale px-4 lg:px-2 py-4 flex flex-col justify-evenly items-center w-72 lg:w-96`}
    >
      <h3 className="text-white text-center font-bold text-md lg:text-xl mt-2">{title}</h3>
      <div className="text-center mt-1">
        <span className="text-white font-bold">{description} </span>
      </div>
    </Link>
  );
};

export default Card;
