import React, { useEffect, useState, useContext } from 'react'; 
import { useParams } from 'react-router-dom'; 
import AuthContext from '../../context/AutoContext'; 
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const API_URL = 'http://127.0.0.1:8000'; 

const Candidate = () => { 
  const [candidates, setCandidates] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasVoted, setHasVoted] = useState(false); 
  const { authTokens } = useContext(AuthContext); 
  const { electionId } = useParams(); 

  const [showAddCandidateForm, setShowAddCandidateForm] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateDescription, setNewCandidateDescription] = useState('');

  useEffect(() => { 
    const fetchUserProfile = async () => {
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

    const fetchCandidates = async () => { 
      try { 
        const response = await fetch(`${API_URL}/elections/elections/${electionId}/candidates/`, { 
          method: 'GET', 
          headers: { 
            'Authorization': `Bearer ${authTokens.access}` 
          } 
        }); 

        if (!response.ok) { 
          throw new Error(`Network response was not ok: ${response.statusText}`); 
        } 

        const data = await response.json(); 
        setCandidates(Array.isArray(data) ? data : []); 
        setLoading(false); 
      } catch (error) { 
        console.error('Error fetching candidates:', error); 
        setError(error.message || 'Unknown error'); 
        setCandidates([]); 
        setLoading(false); 
      } 
    }; 

    if (electionId) { 
      fetchCandidates(); 
    }

    fetchUserProfile();
  }, [electionId, authTokens]); 

  const voteForCandidate = async (candidateId) => {
    try {
      const response = await fetch(`${API_URL}/elections/votes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidate: `${candidateId}` }),
      });
      console.log(JSON.stringify({ candidate: `${candidateId})` }))
      if (!response.ok) {
        const responseText = await response.text();
        const errorMessage = JSON.parse(responseText).detail || 'An error occurred';
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorMessage}`);
      }

      const data = await response.json();
      alert('Vote successful', data);
      setHasVoted(true); 
    } catch (error) {
      console.error('Error voting for candidate:', error);
      const errorMessage = error.message.includes('detail') ? error.message.split('detail":')[1].replace(/[{}"]/g, '') : error.message;
      alert('Error voting for candidate: ' + errorMessage);
    }
  };

  const handleAddCandidate = async () => {
    try {
      const response = await fetch(`${API_URL}/elections/candidates/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCandidateName,
          description: newCandidateDescription,
          election: electionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      alert('Candidate added successfully');
      setCandidates([...candidates, data]);
      setShowAddCandidateForm(false);
      setNewCandidateName('');
      setNewCandidateDescription('');
    } catch (error) {
      console.error('Error adding candidate:', error.message, error);
      alert('Error adding candidate: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error}</div>; 

  return ( 
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-xl font-['Montserrat']">
        <div className="mx-auto max-w-screen-lg lg:text-center w-full mt-16">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Candidates in election</p>
          <div className="h-2 w-[420px] bg-indigo-500 mb-4 rounded-xl mx-auto mt-1"></div>
          <p className="mt-3 text-lg leading-8 text-gray-600 w-[720px] mx-auto mb-12">Meet the candidates running for office. Learn their policies, backgrounds, and visions to make an informed voting decision.</p>
          {isAdmin && (
            <button
              onClick={() => setShowAddCandidateForm(!showAddCandidateForm)}
              className="inline-flex items-center px-3 py-2 text-sm mb-4 font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
            >
              Add Candidate
            </button>
          )}
          {showAddCandidateForm && (
            <div className="mb-4">
              <p>Candidate Name</p>
              <input
                type="text"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                placeholder="Candidate Name"
                className="mb-2 p-2 border rounded-lg"
              />
              <p>Description</p>
              <textarea
                value={newCandidateDescription}
                onChange={(e) => setNewCandidateDescription(e.target.value)}
                placeholder="Candidate Description"
                className="mb-2 p-2 border rounded-lg w-full"
              />
              <button
                onClick={handleAddCandidate}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map(candidate => ( 
            <div key={candidate.id} className="bg-white border border-gray-200 rounded-lg shadow mb-4 p-5 flex flex-col justify-between">
              <div>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{candidate.name}</h5>
                <p className="mb-3 font-normal text-gray-700">{candidate.description}</p>
              </div>
              <button
                onClick={() => voteForCandidate(candidate.id)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 ${hasVoted ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                disabled={hasVoted}
              >
                {hasVoted ? 'VOTED' : 'VOTE NOW'}
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  ); 
}; 

export default Candidate;
