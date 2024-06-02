import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function PasswordResetConfirm() {
    const { uid, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    let navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple checks
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setMessage('Your password must contain at least 8 characters.');
            return;
        }
        if (/^\d+$/.test(newPassword)) {
            setMessage('Your password can’t be entirely numeric.');
            return;
        }

        // Add your own commonly used passwords list
        const commonlyUsedPasswords = ["123456", "password", "12345678", "qwerty", "123456789"];
        if (commonlyUsedPasswords.includes(newPassword)) {
            setMessage('Your password can’t be a commonly used password.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/users/auth/users/reset_password_confirm/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    new_password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Password has been reset!');
            navigate("/auth")
        } catch (error) {
            console.error(error);
            setMessage('An error occurred.');
        }
    };

    return (
        <>
            <Navbar />
            <section className="bg-gray-50 font-lato">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Reset Password
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Enter new password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Confirm new password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <button className="group relative h-11 w-full overflow-hidden rounded-xl bg-violet-600 text-white" type="submit">
                                    Reset Password
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

export default PasswordResetConfirm;
