import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AutoContext'; // Corrected import path
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
export default function Authorization() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { loginUser } = useContext(AuthContext);

    const submit = async (e) => {
        e.preventDefault();
        loginUser(username, password);
        console.log("Attempting login");
    };

    return (
        <>
            <Navbar />
            <section className="bg-gray-50 font-lato">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                    Log in
                                </h1>
                                <p className="font-light font-medium text-[#444444] opacity-90">
                                    Log in to your account
                                </p>
                            </div>
                            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-[#444444] text-[18px] font-lato">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-5 h-12"
                                        placeholder="Username"
                                        required
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-5 h-12"
                                        required
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <button className="group relative h-11 w-full overflow-hidden rounded-xl bg-violet-600 text-white" type="submit">
                                    Log in
                                </button>
                                <p className="text-sm font-light text-[#444] opacity-80">
                                    Do not have an account?
                                    <Link to="/registration" className="font-medium hover:underline text-[#444] ml-2">
                                        Create account
                                    </Link>
                                </p>
                                <p className="text-sm font-light text-[#444] opacity-80">
                                    Forgot your password?
                                    <Link to="/password-reset" className="font-medium hover:underline text-[#444] ml-2">
                                        Change password
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
