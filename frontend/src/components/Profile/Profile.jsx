import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AutoContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { vote } from '../../assets/icons';

const UserProfile = () => {
    const { authTokens } = useContext(AuthContext);
    const [profile, setProfile] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authTokens) {
            setError(new Error('No token found'));
            return;
        }

        fetch('http://127.0.0.1:8000/users/profile/', {
            headers: {
                'Authorization': `Bearer ${authTokens.access}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => setProfile(data))
        .catch(error => setError(error));
    }, [authTokens]);



    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <>
        <Navbar />

            <div className='flex flex-wrap items-center mx-auto justify-between max-w-screen-xl font-["Montserrat"] mt-16'>
                <div className='flex flex-col gap-4 font-medium text-md w-64 w-1/4 border-[1px] border-black border-opacity-25 h-auto rounded-xl p-4'>
                    <h1>Username:</h1>
                    <p className='border-[1px] border-black border-opacity-25 w-full rounded-lg h-10 p-1 shadow-md flex flex-row items-center'>{profile.username}</p>
                    <p>Email:</p>
                    <span className='border-[1px] border-black border-opacity-25  w-full rounded-lg p-1 shadow-md flex flex-row items-center h-10'>{profile.email}</span>
                </div>
                <div className='w-3/4 flex flex-col justify-center items-center'>
                <div className="mx-auto max-w-screen-lg lg:text-center w-full">
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your profile page</p>
              
                <div className="h-2 w-[320px] bg-indigo-500 mb-9 rounded-xl mx-auto mt-1"></div>
                <p className="mt-6 text-lg leading-8 text-gray-600 w-[720px] mx-auto mb-12">The UserProfile page offers users a sleek interface to manage their account details efficiently. Featuring a minimalist design with Tailwind CSS, it showcases essential user information such as <span className="bg-blue-600 text-white rounded-lg p-1 shadow-md">username</span>, <span className="bg-blue-600 text-white rounded-lg p-1 shadow-md">email</span>, <span className="bg-blue-600 text-white rounded-lg p-1 shadow-md">phone number</span>, and <span className="bg-blue-600 text-white rounded-lg p-1 shadow-md">role</span> in an organized grid layout. Users can effortlessly navigate sections using bordered elements for clarity and shadow effects for visual depth. Whether updating personal details or reviewing account information, this page ensures a seamless and visually appealing user experience.</p>
              </div>
                </div>
            </div>
        <Footer />
        </>
    );
};

export default UserProfile;
