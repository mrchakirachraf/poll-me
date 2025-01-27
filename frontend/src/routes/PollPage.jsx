import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Question from '../components/Question';
import styles from '../styles/PollPage.module.css';
import Button from '../components/Button';

const PollPage = () => {
    const { id_sondage } = useParams();
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
        // Check if all required questions have been answered
        const unansweredQuestions = poll.questions.filter((question) => {
            const response = responses[question.id_question];
            return (
                !response || // No response
                (Array.isArray(response) && response.length === 0) // Empty multiple-choice response
            );
        });
    
        if (unansweredQuestions.length > 0) {
            setErrorMessage('Please answer all required questions before submitting.');
            return;
        }
    
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
                navigate('/home-page');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to submit your responses.');
            }
        } catch (error) {
            setErrorMessage('Failed to connect to the server. Please try again.');
        }
    };
    
    
    

    return (
        <div className={`${styles.PollPage_container} text-DeepTale bg-MutedCyan0.1 p-8 lg:p-12 rounded-2xl my-10`}>
            {loading ? (
                <p className="alertInfo">Loading...</p>
            ) : errorMessage && errorMessage !== 'Please answer all required questions before submitting.' ? (
                <div className="relative">
                    <Link className="inline relative top-0 left-0" to={`/home-page`}>
                        <Button style={{}} class="btn_MutedCyan mb-10 w-20 lg:w-32" text="⏴ Back"></Button>
                    </Link>

                    <p className="alertDanger">{errorMessage}</p>
                </div>
            ) : (
                <div>
                    <h1 className="text-center text-3xl font-bold">{poll.title}</h1>
                    <p className="text-center text-xl my-4 mb-4">{poll.description}</p>
                    {poll.questions.map((question) => (
                        <Question
                            key={question.id_question}
                            question={question}
                            response={
                                responses[question.id_question] || (question.type === 'choix_multiple' ? [] : '')
                            }
                            onChange={handleResponseChange}
                        />
                    ))}
                    {errorMessage === 'Please answer all required questions before submitting.' && (
                        <p className="alertDanger mb-4">{errorMessage}</p>
                    )}
                    <div className={`${styles.buttonsGroup} mt-5`}>
                        <Link className="inline" to="/home-page">
                            <Button style={{}} class="btn_DeepTale w-32 lg:w-52" text="Go Back"></Button>
                        </Link>
                        <button onClick={handleSubmit} className="btn_DeepTale w-32 lg:w-52">
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollPage;
