import React, { useState, useEffect } from "react";
import { Link ,useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const UpdatePoll = () => {
  const { id_sondage } = useParams();
  const navigate = useNavigate();
  const [pollData, setPollData] = useState({
    title: "",
    description: "",
    questions: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/sondages/${id_sondage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
          throw new Error("Failed to load poll data.");
        }
        const data = await response.json();
        setPollData({
          title: data.title,
          description: data.description,
          questions: data.questions.map((question) => ({
            id_question: question.id_question,
            text: question.text,
            type: question.type,
            options: question.options.map((option) => option.text),
          })),
        });
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchPollData();
  }, [id_sondage]);

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
      const response = await fetch(`http://127.0.0.1:8000/api/sondages/${id_sondage}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error("Failed to update poll. Please try again.");
      }

      navigate(`/sondages/user/${localStorage.getItem("id_user")}`);
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) return <p className="alertInfo" >Loading...</p>;
  if (error) return <p className="alertDanger">{error}</p>;

  return (
    <div className="container mx-auto lg:px-28 mt-10">
      <div className="relative">
        <h1 className="text-white  text-3xl text-center font-bold mb-10">Update Poll</h1>
        <Link className='inline absolute top-0 left-0' to={`/sondages/user/${localStorage.getItem("id_user")}`}>
            <Button style={{}} class="btn_MutedCyan w-20 lg:w-32" text='<--'></Button>
        </Link>
      </div>
      <form className="bg-MutedCyan0.1 p-4 lg:p-12 rounded-2xl mb-10" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-DeepTale text-xl lg:text-2xl font-bold mb-2">Title</label>
          <input
            type="text"
            className="w-full bg-[#D9D9D9] border border-gray-300 p-2 rounded-xl text-xl"
            value={pollData.title}
            onChange={handleTitleChange}
            placeholder="Title text"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block  text-DeepTale text-xl lg:text-2xl font-bold mb-2">Description</label>
          <textarea
            className="w-full bg-[#D9D9D9] border border-gray-300 p-2 rounded-xl text-xl"
            value={pollData.description}
            onChange={handleDescriptionChange}
            placeholder="Description text"
            required
          />
        </div>
        <h2 className="text-xl text-DeepTale lg:text-2xl  my-2  font-bold mb-4">Questions</h2>
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
                className="w-3/4 bg-[#D9D9D9] border border-gray-300 p-2 rounded-xl text-xl"
                required
              />
              <select
                value={question.type}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "type", e.target.value)
                }
                className="ml-4 text-DeepTale bg-[#D9D9D9] p-2 border border-gray-300 rounded-xl text-xl"
              >
                <option value="choix_unique">Single Choice</option>
                <option value="choix_multiple">Multiple Choice</option>
              </select>
              <button
                type="button"
                className="ml-4 btn_Red text-white px-4 py-2"
                onClick={() => removeQuestion(qIndex)}
              >
                Remove
              </button>
            </div>
            <h3 className="text-DeepTale font-bold text-xl my-2 ">Options</h3>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Option text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="w-3/4 bg-[#D9D9D9] border border-gray-300 p-2 rounded-xl text-xl"
                  required
                />
                <button
                  type="button"
                  className="ml-4 btn_Red  px-4 py-2"
                  onClick={() => removeOption(qIndex, oIndex)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn_MutedCyan mt-2 px-4 py-2"
              onClick={() => addOption(qIndex)}
            >
              Add Option
            </button>
          </div>
        ))}
        <div className="w-full flex justify-between">
          <button
            type="button"
            className="btn_MutedCyan px-4 py-2  mb-4"
            onClick={addQuestion}
          >
            Add Question
          </button>
          <button type="submit" className="btn_DeepTale w-40 lg:w-60 font-bold px-6 py-2">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePoll;
