import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import AuthContext from '../../context/AutoContext';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { vote, vote2, vote4, vote5, vote6, vote7, vote8, vote9, vote10, vote11 } from "../../assets/icons";

const API_URL = 'http://127.0.0.1:8000';

const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { authTokens } = useContext(AuthContext);
  const [closedElectionData, setClosedElectionData] = useState(() => {
    const data = localStorage.getItem('closedElectionData');
    return data ? JSON.parse(data) : {};
  });
  const [disabledCloseButtons, setDisabledCloseButtons] = useState({});
  const electionImages = [vote, vote2, vote4, vote5, vote6, vote7, vote8, vote9, vote10, vote11];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setIsAdmin(data.is_admin);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message || 'Unknown error');
      }
    };

    const fetchElections = async () => {
      try {
        const response = await fetch(`${API_URL}/elections/elections/`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          }
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API response:", data);
        setElections(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching elections:", error);
        setError(error.message || 'Unknown error');
        setElections([]);
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchElections();
  }, [authTokens]);

  const closeElection = async (electionId) => {
    try {
      const response = await fetch(`${API_URL}/elections/close-election/${electionId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${responseText}`);
      }

      const data = await response.json();
      console.log('Election closed successfully:', data);

      const updatedData = {
        ...closedElectionData,
        [electionId]: data
      };
      setClosedElectionData(updatedData);
      localStorage.setItem('closedElectionData', JSON.stringify(updatedData));

      // Disable the close button for this specific election
      setDisabledCloseButtons((prevState) => ({
        ...prevState,
        [electionId]: true
      }));
    } catch (error) {
      console.error('Error closing the election:', error.message, error);
    }
  };

  const clearClosedElectionData = () => {
    localStorage.removeItem('closedElectionData');
    setClosedElectionData({});
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-xl font-['Montserrat']">
        <div className="mx-auto max-w-screen-lg lg:text-center w-full mt-24">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Available elections</p>
          <div className="h-2 w-[360px] bg-indigo-500 mb-4 rounded-xl mx-auto mt-1"></div>
          <p className="mt-3 text-lg leading-8 text-gray-600 w-[720px] mx-auto mb-12">Upcoming elections include local, state, and national races. Stay informed and vote to shape your community and country's future.</p>
          {isAdmin && (
            <>
              <Link
                to="/add-election"
                className="inline-flex items-center px-3 py-2 text-sm mb-4 font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
              >
                Add Election
              </Link>
              <button
                onClick={clearClosedElectionData}
                className="inline-flex items-center px-3 py-2 text-sm mb-4 font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-2"
              >
                Clear Closed Election Data
              </button>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map(election => (
            <div key={election.id} className="bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-between mb-4">
              <a href="#">
                <img className="rounded-t-lg w-full h-48 object-cover" src={electionImages[Math.floor(Math.random() * electionImages.length)]} alt="" />
              </a>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{election.title}</h5>
                  <p className="mb-3 font-normal text-gray-700">{election.description}</p>
                  <p className="mb-1 font-normal text-gray-700">Start Date: {format(new Date(election.start_date), 'MMMM dd, yyyy hh:mm a')}</p>
                  <p className="mb-3 font-normal text-gray-700">End Date: {format(new Date(election.end_date), 'MMMM dd, yyyy hh:mm a')}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  {closedElectionData[election.id] ? (
                    <button
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-500 bg-gray-300 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      View Candidates
                      <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/candidate/${election.id}`, { state: { isClosed: !!closedElectionData[election.id] } })}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                      View Candidates
                      <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </button>
                  )}
                  {isAdmin && !closedElectionData[election.id] && (
                    <button
                      onClick={() => closeElection(election.id)}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-red-300 ${disabledCloseButtons[election.id] ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'}`}
                      disabled={disabledCloseButtons[election.id]}
                    >
                      Close Election
                    </button>
                  )}
                </div>
                {closedElectionData[election.id] && (
                  <div className="mt-4 p-4 bg-yellow-200 rounded-lg">
                    <h3 className="text-lg font-semibold">Candidates and Votes:</h3>
                    <ul>
                      {Object.entries(closedElectionData[election.id]).map(([candidate, votes]) => {
                        const totalVotes = Object.values(closedElectionData[election.id]).reduce((acc, curr) => acc + curr, 0);
                        const votePercentage = totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(2);

                        return (
                          <li key={candidate} className="mb-2">
                            <p>{candidate}: {votes} votes ({votePercentage}%)</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className={`h-2.5 rounded-full ${totalVotes === 0 ? 'bg-gray-400' : 'bg-blue-600'}`} style={{ width: `${votePercentage}%` }}></div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ElectionsList;
