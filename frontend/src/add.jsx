import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './context/AutoContext'; // Ensure the correct import path
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
export default function CreateElection() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [message, setMessage] = useState("");
    const { authTokens } = useContext(AuthContext);
    const [userId, setUserId] = useState(null);

    let navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/users/profile/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.id); // Adjust according to the actual user ID field in the response
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching user profile:', errorData);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [authTokens]);

    const formatDateTime = (date, time) => {
        return `${date}T${time}:00Z`;
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        if (new Date(newStartDate) > new Date(endDate)) {
            setEndDate("");
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('User ID not available. Please try again.');
            return;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            setMessage('End date must be after the start date.');
            return;
        }

        const electionData = {
            title: title,
            description: description,
            start_date: formatDateTime(startDate, startTime),
            end_date: formatDateTime(endDate, endTime),
            created_by: `${userId}`, // Ensure this line includes userId
        };

        console.log(JSON.stringify(electionData));

        try {
            const response = await fetch('http://127.0.0.1:8000/elections/elections/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify(electionData),
            });

            if (response.ok) {
                setMessage("Election created successfully.");
                navigate("/")
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    setMessage(`Error: ${JSON.stringify(errorData)}`);
                } catch (jsonError) {
                    setMessage(`Error: ${errorText}`);
                }
            }
        } catch (error) {
            console.error('Error creating election:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
       <>
        <Navbar />
        <section className="bg-white font-['Montserrat']">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create Election
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                            <div>
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Title"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Description"
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                    value={startDate}
                                    min={getTodayDate()}
                                    onChange={handleStartDateChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="startTime" className="block mb-2 text-sm font-medium text-gray-900">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    id="startTime"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    id="endDate"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                    value={endDate}
                                    min={startDate || getTodayDate()}
                                    onChange={e => setEndDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-gray-900">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    id="endTime"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                />
                            </div>
                            <button className="group relative h-11 w-full overflow-hidden rounded-xl bg-violet-600 text-white" type="submit">
                                Create Election
                            </button>
                            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
       </>
    );
}
