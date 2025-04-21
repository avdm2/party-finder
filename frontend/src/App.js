import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateProfile from "./components/participant/CreateProfile";
import UserProfile from "./components/participant/UserProfile";
import OrganizerProfile from "./components/organizer/OrganizerProfile";
import FindEvent from "./components/participant/FindEvent";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Header from "./components/Header";
import { useAuth } from './components/auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePageParticipant from "./components/homepage/HomePageParticipant";
import HomePageOrganizer from "./components/homepage/HomePageOrganizer";
import EventsPage from "./components/organizer/Events";
import ChannelInterface from "./components/organizer/ChannelInterface";
import Loyalty from "./components/Loyalty";
import Chats from "./components/participant/chat/Chats"

const App = () => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    const routesWithoutHeader = ['/login', '/register'];

    const shouldShowHeader = !routesWithoutHeader.includes(location.pathname);

    return (
        <div className="App">
            {shouldShowHeader && <Header />}
            <Routes>
                <Route
                    path="/home"
                    element={
                        role === 'ORGANIZER'
                            ? <ProtectedRoute><HomePageOrganizer /></ProtectedRoute>
                            : <ProtectedRoute><HomePageParticipant /></ProtectedRoute>
                    }
                />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
                <Route path="/profile/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/organizer-profile/:username" element={<ProtectedRoute><OrganizerProfile /></ProtectedRoute>} />
                <Route path="/organizer-profile/" element={<ProtectedRoute><OrganizerProfile /></ProtectedRoute>} />
                <Route path="/find-event" element={<ProtectedRoute><FindEvent /></ProtectedRoute>} />
                <Route path="/channel/:channelId" element={<ChannelInterface />} />
                <Route path="/loyalty/organizer/:organizerId" element={<Loyalty />} />
                {role === 'PARTICIPANT' && (
                    <Route path="/chat" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                )}
                {role === 'PARTICIPANT' && (
                    <Route path="/chat/:id" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                )}
            </Routes>
        </div>
    );
};

export default App;