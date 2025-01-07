import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeletePollPage = () => {
    const { id_sondage } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/sondages/${id_sondage}`,
            {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "application/json",
            },
            }
        );

        if (response.status === 200) {
            navigate(`/sondages/user/${localStorage.getItem("id_user")}`); 
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Failed to delete the poll.");
        }
        } catch (error) {
        alert("An error occurred while deleting the poll. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate(`/sondages/user/${localStorage.getItem("id_user")}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-white text-2xl font-bold text-center mb-4">
                Are you sure you want to delete this poll?
            </h1>
            <div className="flex gap-4">
                <button
                onClick={handleDelete}
                className="btn_Red text-white px-4 py-2"
                >
                    Yes, Delete
                </button>
                <button
                onClick={handleCancel}
                className="btn_MutedCyan text-white px-4 py-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
    };

export default DeletePollPage;
