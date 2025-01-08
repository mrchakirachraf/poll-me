import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "../styles/StatisticsPage.module.css";
import Button from "../components/Button";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsPage = () => {
    const { id_sondage } = useParams(); // Get poll ID from the URL
    const [statistics, setStatistics] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
        try {
            const response = await fetch(
            `http://127.0.0.1:8000/api/sondages/${id_sondage}/statistics`,
            {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "application/json",
                },
            }
            );

            if (response.status === 200) {
            const data = await response.json();
            setStatistics(data);
            } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || "Failed to fetch statistics.");
            }
        } catch (error) {
            setErrorMessage("Failed to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
        };

        fetchStatistics();
    }, [id_sondage]);

    if (loading) {
        return <p className="alertInfo">Loading...</p>;
    }

    if (errorMessage) {
        return <p className="alertDanger">{errorMessage}</p>;
    }

    return (
        <div className={styles.StatisticsPage_container}>
            <Link className='inline' to={`/sondages/user/${localStorage.getItem("id_user")}`}>
                <Button style={{}} class="btn_MutedCyan w-20 lg:w-32" text='⏴ Back'></Button>
            </Link>
            <h1 className="text-white  text-center text-3xl font-bold mb-4">
                Statistics for: {statistics.sondage}
            </h1>
            {statistics.statistics.map((question, index) => (
                <div key={index} className={styles.chartContainer}>
                    <h2 className="text-lg text-center font-semibold mb-2">{question.question_text}</h2>
                    <Bar
                        data={{
                        labels: question.options.map((option) => option.option_text),
                        datasets: [
                            {
                            label: "Number of Responses",
                            data: question.options.map((option) => option.response_count),
                            backgroundColor: "rgba(10, 140, 140,0.6)",
                            borderColor: "rgba(10, 140, 140, 1)",
                            borderWidth: 1,
                            },
                            {
                            label: "Percentage",
                            data: question.options.map((option) => option.percentage),
                            backgroundColor: "rgba(255, 200, 60, 0.6)",
                            borderColor: "rgba(255, 200, 60, 1)",
                            borderWidth: 1,
                            },
                        ],
                        }}
                        // options={{
                        // responsive: true,
                        // plugins: {
                        //     legend: {
                        //     position: "top",
                        //     },
                        //     title: {
                        //     display: true,
                        //     text: `Total Responses: ${question.total_responses}`,
                        //     },
                        // },
                        // }}
                    />
                </div>
            ))}
        </div>
  );
};

export default StatisticsPage;
