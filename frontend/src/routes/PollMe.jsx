import React from 'react';
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import styles from '../styles/PollMe.module.css'; 

const PollMe = () => {
    return (
        <div
            className={`${styles.indexPage} flex flex-col items-center justify-center min-h-screen bg-MutedCyan0.1 bg-opacity-10 text-DeepTale`}
        >
            <div className="text-center p-8 lg:p-12 bg-MutedCyan0.1 opacity-100 shadow-lg rounded-xl flex flex-col justify-evenly items-center">
                <h1 className="text-4xl font-extrabold">WELCOME<br />TO<br /></h1>
                <div className="h-40">
                    <img className="w-full h-full" src="./src/assets/DeepTale PollMe.png" alt="" />
                </div>
                <p className="text-xl text-gray-600 mb-6">
                    Ready to explore? Get started with PollMe today!
                    <br />
                    Create, share, and participate in interactive surveys with ease.
                </p>
                <div className="flex flex-row flex-wrap justify-evenly gap-4">
                    <Link to="/signin">
                        <Button
                            style={{}}
                            class="btn_DeepTale w-40 lg:w-52"
                            text="Sign In"
                        />
                    </Link>
                    <Link to="/signup">
                        <Button
                            style={{}}
                            class="btn_DeepTale w-40 lg:w-52"
                            text="Sign Up"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PollMe;
