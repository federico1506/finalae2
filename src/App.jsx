/* eslint-disable no-unused-vars */
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import appFirebase from "./credenciales"
const auth = getAuth(appFirebase)
import { useAuth } from './AuthContext';
import { useNavigate } from "react-router-dom";

import Dashboard from "./components/General/Dashboard"
import AdminDashboard from './components/Admin/AdminDashboard';
import Tipo1Dashboard from "./components/Tipo1/Tipo1Dashboard"
import Tipo2DashBoard from "./components/Tipo2/Tipo2Dashboard"

function App() {
  const { isLoggedIn, userRole } = useAuth();
  return (
    <div>
          {isLoggedIn ? (
            <>
              {userRole === 'paciente' && (
                <>
                  <Tipo2DashBoard/>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <AdminDashboard/>
                </>
              )}
              {userRole === 'doctor' && (
                <>
                  <Tipo1Dashboard/>
                </>
              )}
            </>
          ) : (
            <>
              <Dashboard/>
            </>
          )}
    </div>
)}
export default App
