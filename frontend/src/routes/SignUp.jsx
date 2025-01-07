import React, { useState } from 'react';
import Button from "../components/Button";
import styles from "../styles/SignUp.module.css";
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();

        const body = { name, email, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.status === 200) {
                const data = await response.json();

                console.log('Registration successful:', data.message);
                navigate('/signin');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'An error occurred while signing up.');
            }
        } catch (error) {
            setErrorMessage('Failed to connect to the server. Please try again.');
        }
    };

    return (
        <div className={styles.PollMe_container}>
            <div id={styles.overlay}>
                <div id={styles.logo}>
                    {/* Here we will add the logo image */}
                </div>
                <div>
                    <form onSubmit={handleSignUp} method='post'>
                        <h2>Sign Up</h2>
                        <div className={styles.form_group}>
                            <label htmlFor="nameInput">Name</label>
                            <input
                                name="name"
                                type="text"
                                id="nameInput"
                                placeholder="Enter your name ..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="emailInput">Email</label>
                            <input
                                name="email"
                                type="email"
                                id="emailInput"
                                placeholder="Enter your email ..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="passwordInput">Password</label>
                            <input
                                name="password"
                                type="password"
                                id="passwordInput"
                                placeholder="Enter your password ..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && (
                            <div className="alertDanger">
                                <p>{errorMessage}</p>
                            </div>
                        )}
                        <div className={`${styles.buttonsGroup}`}>
                            <button type='submit' className="btn_DeepTale w-32 lg:w-52">
                                Sign Up
                            </button>
                            <Link className='inline' to="/signin">
                                <Button style={{}} class="btn_DeepTale w-32 lg:w-52" text='Go Back'></Button>
                            </Link>
                        </div>
                        <span style={{ textAlign: 'center' }}>
                            Already have an account? &nbsp;
                            <Link className='inline text-DeepTale' to="/signin">
                                <u className='text-DeepTale'>Sign In</u>
                            </Link>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
