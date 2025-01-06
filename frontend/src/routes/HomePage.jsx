import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
    const [polls, setPolls] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/sondages', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setPolls(data); // Set the polls data in state
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to fetch polls.');
                }
            } catch (error) {
                setErrorMessage('Failed to connect to the server. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <div className={styles.PollList_container}>
            <h1 className="text-center text-2xl font-bold my-4">Available Polls</h1>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : errorMessage ? (
                <div className="text-center text-red-500">
                    <p>{errorMessage}</p>
                </div>
            ) : (
                <div className={`${styles.PollList_flex} mt-5`}>
                    {polls.map((poll) => (
                        <Card
                            key={poll.id_sondage}
                            link = {`/sondages/${poll.id_sondage}`}
                            title={poll.title}
                            description={poll.description}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
