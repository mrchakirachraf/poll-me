import React from 'react';
import styles from './componentsStyles/Question.module.css';

const Question = ({ question, response, onChange }) => {
    const handleOptionChange = (optionId) => {
        if (question.type === 'choix_unique') {
            onChange(question.id_question, optionId);
        } else if (question.type === 'choix_multiple') {
            const updatedResponse = response.includes(optionId)
                ? response.filter((id) => id !== optionId)
                : [...response, optionId];
            onChange(question.id_question, updatedResponse);
        }
    };

    return (
        <div className={styles.Question_container}>
            <h3 className="font-bold mb-2">{question.text}</h3>
            <div className={styles.Options_container}>
                {question.options.map((option) => (
                    <label key={option.id_option} className={styles.Option_label}>
                        <input
                            type={question.type === 'choix_unique' ? 'radio' : 'checkbox'}
                            name={`question-${question.id_question}`}
                            value={option.id_option}
                            checked={
                                question.type === 'choix_unique'
                                    ? response === option.id_option
                                    : response.includes(option.id_option)
                            }
                            onChange={() => handleOptionChange(option.id_option)}
                        />
                        {option.text}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Question;
