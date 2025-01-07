import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card';
import styles from '../styles/UserPage.module.css';
import Button from '../components/Button';

const UserPage = () => {
    const { id_user } = useParams();
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
                    setUserPolls(data);
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

    // if (loading) {
    //     return <p className="alertInfo">Loading...</p>;
    // }

    // if (errorMessage) {
    //     return <p className="alertDanger">{errorMessage}</p>;
    // }

    return (
        <div className={styles.UserPage_container}>
            <div className='my-10' style={{position:"relative"}}>
                <h1 className="text-white text-center text-2xl lg:text-3xl font-bold">My Polls</h1>
                <Link style={{position:"absolute",top:"0",right:"0"}} className='inline' to={`/sondages/addPoll`}>
                    <Button style={{}} class="btn_MutedCyan w-32 lg:w-52" text='Add new poll'></Button>
                </Link>
            </div>
            {loading ? (
                <p className="alertInfo">Loading...</p>
            ) : errorMessage ? (
                <div className="alertDanger">
                    <p>{errorMessage}</p>
                </div>
            ) : (
                <div className={`mt-10 ${styles.UserPage_flex}`}>
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
                                        <button className='btn_MutedCyan w-fit lg:w-32'>Modify</button>
                                    </Link>
                                    <Link className='inline' to={`/sondages/${poll.id_sondage}/delete`}>
                                        <button className='btn_Red w-fit lg:w-32'>Delete</button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full alertInfo">
                            <p>You haven't created any polls yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserPage;
