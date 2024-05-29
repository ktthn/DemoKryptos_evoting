import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );

    const [loading, setLoading] = useState(true);

    let navigate = useNavigate();

    const loginUser = async (username, password) => {
        const url = "http://127.0.0.1:8000/users/login/";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
                navigate("/");
            } else {
                alert("You entered uncorrect login or password!");
            }
        } catch (error) {
            console.error("An error occurred while logging in:", error);
        }
    };

    const registerUser = async (email, username, password) => {
        try {
          const response = await fetch('http://127.0.0.1:8000/users/register/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              username: username,
              password: password,
            }),
          });
        //   const data = await response.json();
        //   setAuthTokens(data);
        //   console.log()
          if (!response.ok) {
            const errorData = await response.json();
            return { success: false, errors: errorData };
            }

        if (response.ok) {
            alert("Registration was successfully done")
            navigate("/auth")
        }
          } catch (error) {
            return { success: false, errors: { detail: 'Registration failed' } };
          }
        };
      
      const logoutUser = () => {
          setAuthTokens(null);
          setUser(null);
          localStorage.removeItem("authTokens");
          navigate("/auth");
      };
      
      useEffect(() => {
          if (authTokens) {
              setUser(jwtDecode(authTokens.access));
          }
          setLoading(false);
      }, [authTokens, loading]);
      
      const isAdmin = user && user.is_admin;
      
      const contextData = {
          user,
          isAdmin,
          authTokens,
          setAuthTokens,
          registerUser,
          loginUser,
          logoutUser,
      };
      
      return (
          <AuthContext.Provider value={contextData}>
              {loading ? null : children}
          </AuthContext.Provider>
      );
    }
