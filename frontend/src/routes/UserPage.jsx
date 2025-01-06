import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import styles from '../styles/UserPage.module.css';

const UserPage = () => {
    const { id_user } = useParams(); // Extract the user ID from the URL
    const [userPolls, setUserPolls] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPolls = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/sondages/user/${id_user}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setUserPolls(data); // Save the user's polls
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to fetch user polls.');
                }
            } catch (error) {
                setErrorMessage('Failed to connect to the server. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserPolls();
    }, [id_user]);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    if (errorMessage) {
        return <p className="text-center text-red-500">{errorMessage}</p>;
    }

    return (
        <div className={styles.UserPage_container}>
            <h1 className="text-center text-2xl font-bold">Your Polls</h1>
            <div className={styles.UserPage_flex}>
                {userPolls.length > 0 ? (
                    userPolls.map((poll) => (
                        <div>
                            <Card
                                key={poll.id_sondage}
                                link = {`/sondages/${poll.id_sondage}/statistics`}
                                title={poll.title}
                                description={poll.description}
                            />
                            <div className={`${styles.buttonsGroup} mt-5`}>
                                <Link className='inline' to={`/sondages/${poll.id_sondage}/update`}>
                                    <button className='btn_DeepTale w-fit lg:w-32'>Modify</button>
                                </Link>
                                <Link className='inline' to={`/sondages/${poll.id_sondage}/delete`}>
                                    <button className='btn_DeepTale w-fit lg:w-32'>Delete</button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">You haven't created any polls yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserPage;
