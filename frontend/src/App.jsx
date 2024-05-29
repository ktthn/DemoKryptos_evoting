import Home from "./Home"
import Authorization from "./components/Auth/Authorization";
import Registration from "./components/Registration/Registration";
import Error from "./Error.jsx";
import {AuthProvider} from './context/AutoContext';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

import Profile from "./components/Profile/Profile.jsx";
import Elections from "./components/ElectionPage/Elections.jsx"
import Election from "./components/Election/Election";
import Candidate from "./components/Candidate/Candidate";
import ChangePassword from "./components/ChangePassword/changePassword.jsx";
import ResetPassword from './components/ResetPassword/ResetPassword.jsx'
import Add from './add.jsx'
export default function App() {
  return (
     <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/auth" element={<Authorization />}/>
          <Route path="/registration" element={<Registration />}/>
          <Route path="*" element={<Error />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/elections/candidates/" element={<Elections />} />
          <Route path="/election" element={<Election />} />
          <Route path="/candidate/:electionId" element={<Candidate />} />
          <Route path="/password-reset" element={<ChangePassword />} />
          <Route path="/password-reset/confirm/:uid/:token" element={<ResetPassword/>} />
          <Route path="/add-election" element={<Add />} />
        </Routes>
      </AuthProvider>
     </>
  )
}