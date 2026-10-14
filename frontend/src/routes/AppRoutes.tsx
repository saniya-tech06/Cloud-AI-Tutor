import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import StudySpaces from "../pages/StudySpaces";
import NewStudySpace from "../pages/NewStudySpace";
import StudySpace from "../pages/StudySpace";
import Progress from "../pages/Progress";
import Profile from "../pages/Profile";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>


        {/* Public Routes */}

        <Route 
          path="/" 
          element={<Login />} 
        />

        <Route 
          path="/register" 
          element={<Register />} 
        />



        {/* Protected Routes */}


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />


        <Route
          path="/study-spaces"
          element={
            <ProtectedRoute>
              <StudySpaces />
            </ProtectedRoute>
          }
        />


        <Route
          path="/new-study-space"
          element={
            <ProtectedRoute>
              <NewStudySpace />
            </ProtectedRoute>
          }
        />


        <Route 
 path="/study-space/:id" 
 element={
  <ProtectedRoute>
    <StudySpace />
  </ProtectedRoute>
 }
/>


      </Routes>

    </BrowserRouter>
  );
}


export default AppRoutes;