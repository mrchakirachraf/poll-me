import React from "react";
import { Link } from "react-router-dom"; 
import styles from "./componentsStyles/Card.module.css";

const Card = ({ id , title, description}) => {
  return (
    <Link
      to={`/sondage/${id}`} 
      className={`${styles.DeepTale_border} bg-white px-4 lg:px-2 py-4 flex flex-col justify-evenly items-center w-56 lg:w-80`}
    >
      <h3 className="text-black text-center font-bold text-md lg:text-xl mt-2">{title}</h3>
      <div className="text-center mt-1">
        <span className="text-black font-bold">{description} </span>
      </div>
    </Link>
  );
};

export default Card;
