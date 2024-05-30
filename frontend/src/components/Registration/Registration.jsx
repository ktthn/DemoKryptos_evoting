import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AutoContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';


export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { registerUser } = useContext(AuthContext);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const submit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await registerUser(email, username, password);
    if (!result.success) {
      setErrors(result.errors);
      console.error("Registration errors:", result.errors); // Log errors to console
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 font-['Montserrat']">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Create an account
                </h1>
                <p className="font-light font-medium text-[#444444] opacity-90">
                  Join the e-voting platform today!
                </p>
              </div>
              <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#444444] text-[18px] font-lato">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-5 h-12"
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                                  {errors.non_field_errors && errors.non_field_errors.map((error, index) => (
                  <p key={index} className="text-red-600">{error}</p>
                ))}
                  {errors.email && <p className="text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-[#444444] text-[18px] font-lato">
                    Nickname
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-5 h-12"
                    placeholder="Username"
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                  {errors.username && <p className="text-red-600">{errors.username[0]}</p>}
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
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="group relative h-11 w-full overflow-hidden rounded-xl bg-violet-600 text-white" type="submit">
                  Register
                </button>
                {errors.detail && <p className="text-red-600">{errors.detail}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
