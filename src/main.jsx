import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './AuthContext.jsx';

import Dashboard from './components/General/Dashboard.jsx';
import Layout from './components/Layout/Layout.jsx';
import Tipo2Form from './components/Tipo2/Tipo2Form.jsx'
import Login from './components/General/Login.jsx';
import ErrorPage from './components/common/ErrorPage.jsx';
import NavBar from "./components/common/NavBar"
import Footer from "./components/General/Footer"
import Tipo2Dashboard from './components/Tipo2/Tipo2Dashboard.jsx';
import Tipo1Dashboard from './components/Tipo1/Tipo1Dashboard.jsx';
import Tipo1_RegistrationForm from './components/Admin/Tipo1_RegistrationForm.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import Citas from './components/Citas/Citas.jsx';
import CitasDashboard from './components/Citas/CitasDashboard.jsx';

const router = createBrowserRouter([
// ROUTES pagina inicio
{element: <Layout/>, children: [  {
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />,
},
{
  path: "/Dashboard",
  element: <Dashboard />,
  errorElement: <ErrorPage />,
},
{
  path: "/Login",
  element: <Login />,
  errorElement: <ErrorPage />,
},
{
  path: "/Register",
  element: <Tipo2Form />,
  errorElement: <ErrorPage />,
},


// ROUTES tipo2
{
  path: "/Form2",
  element: <Tipo2Dashboard />,
  errorElement: <ErrorPage />,
},
{
  path: "/FormCitas",
  element: <Citas />,
  errorElement: <ErrorPage />,
},
{
  path: "/DashboardCitas",
  element: <CitasDashboard />,
  errorElement: <ErrorPage />,
},



// ROUTES tipo1
{
  path: "/Form1",
  element: <Tipo1Dashboard />,
  errorElement: <ErrorPage />,
},


// ROUTES admin
{
  path: "/Admin",
  element: <AdminDashboard />,
  errorElement: <ErrorPage />,
},
{
  path: "/Register2",
  element: <Tipo1_RegistrationForm />,
  errorElement: <ErrorPage />,
},]}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider>
          <RouterProvider router={router}>
            <NavBar/>
            <App />
            <Footer/>
          </RouterProvider>
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>,
)
