import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Question from '../components/Question'; // Reusable component for questions
import styles from '../styles/PollPage.module.css';
import Button from '../components/Button';

const PollPage = () => {
    const { id_sondage } = useParams(); // Get the poll ID from the route params
    const [poll, setPoll] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/sondages/${id_sondage}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setPoll(data);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to load the poll.');
                }
            } catch (error) {
                setErrorMessage('Failed to connect to the server. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, [id_sondage]);

    const handleResponseChange = (questionId, value) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async () => {
        // Format the responses into the required API body
        const formattedResponses = Object.entries(responses).flatMap(([questionId, value]) => {
            if (Array.isArray(value)) {
                // Multiple choice
                return value.map((optionId) => ({
                    id_question: parseInt(questionId),
                    id_option: optionId,
                }));
            } else {
                // Single choice
                return { id_question: parseInt(questionId), id_option: value };
            }
        });
    
        const requestBody = {
            id_sondage: parseInt(id_sondage),
            responses: formattedResponses,
        };
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/sondages/${id_sondage}/responses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            if (response.status === 200) {
                navigate('/home-page'); // Redirect to home page on success
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to submit your responses.');
            }
        } catch (error) {
            setErrorMessage('Failed to connect to the server. Please try again.');
        }
    };
    
    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    if (errorMessage) {
        return <p className="text-center text-red-500">{errorMessage}</p>;
    }

    return (
        <div className={styles.PollPage_container}>
            <h1 className="text-center text-2xl font-bold">{poll.title}</h1>
            <p className="text-center mb-4">{poll.description}</p>
            {poll.questions.map((question) => (
                <Question
                    key={question.id_question}
                    question={question}
                    response={responses[question.id_question] || (question.type === 'choix_multiple' ? [] : '')}
                    onChange={handleResponseChange}
                />
            ))}
            <div className={`${styles.buttonsGroup} mt-5`}>
                <button onClick={handleSubmit} className="btn_DeepTale w-32 lg:w-52">Submit</button>
                <Link className='inline' to="/home-page">
                    <Button style={{}} class="btn_DeepTale w-32 lg:w-52" text='Go Back'></Button>
                </Link>
            </div>
        </div>
    );
};

export default PollPage;
