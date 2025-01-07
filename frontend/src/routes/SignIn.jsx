import React, { useState } from 'react';
import Button from "../components/Button";
import styles from "../styles/SignIn.module.css";
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (event) => {
        event.preventDefault();

        const body = { email, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.status === 200) {
                const data = await response.json();
                const { token } = data;
                const { id_user } = data.user;

                localStorage.setItem('id_user', id_user);
                localStorage.setItem('authToken', token);
                
                navigate('/home-page');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'An error occurred while signing in.');
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
                    <form onSubmit={handleSignIn} method='post'>
                        <h2>Sign In</h2>
                        <div className={styles.form_group}>
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input
                                name="email"
                                type="email"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Enter your email ..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input
                                name="password"
                                type="password"
                                id="exampleInputPassword1"
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
                                Sign In
                            </button>
                            <Link className='inline' to="/">
                                <Button style={{}} class="btn_DeepTale w-32 lg:w-52" text='Go Back'></Button>
                            </Link>
                        </div>
                        <span style={{ textAlign: 'center' }}>
                            If you don't have an account &nbsp;
                            <Link className='inline text-DeepTale' to="/signup">
                                <u className='text-DeepTale'>click here</u>
                            </Link>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
