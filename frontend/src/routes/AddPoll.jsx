import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPoll = () => {
    const navigate = useNavigate();
    const [pollData, setPollData] = useState({
        title: "",
        description: "",
        questions: [],
    });
    const [error, setError] = useState("");

    const handleTitleChange = (e) => {
        setPollData({ ...pollData, title: e.target.value });
    };

    const handleDescriptionChange = (e) => {
        setPollData({ ...pollData, description: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...pollData.questions];
        updatedQuestions[index][field] = value;
        setPollData({ ...pollData, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...pollData.questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setPollData({ ...pollData, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setPollData({
        ...pollData,
        questions: [
            ...pollData.questions,
            { text: "", type: "choix_unique", options: [""] },
        ],
        });
    };

    const addOption = (qIndex) => {
        const updatedQuestions = [...pollData.questions];
        updatedQuestions[qIndex].options.push("");
        setPollData({ ...pollData, questions: updatedQuestions });
    };

    const removeOption = (qIndex, oIndex) => {
        const updatedQuestions = [...pollData.questions];
        updatedQuestions[qIndex].options.splice(oIndex, 1);
        setPollData({ ...pollData, questions: updatedQuestions });
    };

    const removeQuestion = (index) => {
        const updatedQuestions = [...pollData.questions];
        updatedQuestions.splice(index, 1);
        setPollData({ ...pollData, questions: updatedQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await fetch("http://127.0.0.1:8000/api/sondages", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pollData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add poll. Please try again.");
        }

        navigate(`/sondages/user/${localStorage.getItem("id_user")}`);
        } catch (error) {
        setError(error.message);
        }
    };

    return (
        <div className="container mx-auto text-white  mt-10">
            <h1 className="text-2xl font-bold mb-5">Add New Poll</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="block font-bold mb-2">Title</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 p-2"
                    value={pollData.title}
                    onChange={handleTitleChange}
                    required
                />
                </div>
                <div className="mb-4">
                <label className="block font-bold mb-2">Description</label>
                <textarea
                    className="w-full border border-gray-300 p-2"
                    value={pollData.description}
                    onChange={handleDescriptionChange}
                    required
                />
                </div>
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                {pollData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                        <input
                            type="text"
                            placeholder="Question text"
                            value={question.text}
                            onChange={(e) =>
                            handleQuestionChange(qIndex, "text", e.target.value)
                            }
                            className="w-3/4 border border-gray-300 p-2"
                            required
                        />
                        <select
                            value={question.type}
                            onChange={(e) =>
                            handleQuestionChange(qIndex, "type", e.target.value)
                            }
                            className="ml-4 p-2 border border-gray-300"
                        >
                            <option value="choix_unique">Single Choice</option>
                            <option value="choix_multiple">Multiple Choice</option>
                        </select>
                        <button
                            type="button"
                            className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => removeQuestion(qIndex)}
                        >
                            Remove
                        </button>
                        </div>
                        <h3 className="font-bold">Options</h3>
                        {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center mb-2">
                            <input
                            type="text"
                            placeholder="Option text"
                            value={option}
                            onChange={(e) =>
                                handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                            className="w-3/4 border border-gray-300 p-2"
                            required
                            />
                            <button
                            type="button"
                            className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => removeOption(qIndex, oIndex)}
                            >
                            Remove
                            </button>
                        </div>
                    ))}
                    <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => addOption(qIndex)}
                    >
                        Add Option
                    </button>
                </div>
                ))}
                <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                onClick={addQuestion}
                >
                    Add Question
                </button>
                <button type="submit" className="bg-indigo-500 text-white px-6 py-2 rounded">
                    Create Poll
                </button>
            </form>
        </div>
    );
};

export default AddPoll;
