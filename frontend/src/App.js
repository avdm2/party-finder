import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateProfile from "./components/participant/profile/CreateProfile";
import UserProfile from "./components/participant/profile/UserProfile";
import OrganizerProfile from "./components/organizer/OrganizerProfile";
import FindEvent from "./components/participant/event/FindEvent";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Header from "./components/Header";
import { useAuth } from './components/auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePageParticipant from "./components/homepage/HomePageParticipant";
import HomePageOrganizer from "./components/homepage/HomePageOrganizer";
import EventsPage from "./components/organizer/Events";
import ChannelInterface from "./components/organizer/ChannelInterface";
import Loyalty from "./components/organizer/Loyalty";
import Chats from "./components/participant/chat/Chats"
import EventPage from "./components/participant/event/EventPage";
import MyEventsPage from "./components/participant/event/MyEventPage";
import Analytics from "./components/organizer/Analytics";
import LoyaltyClient from "./components/participant/LoyaltyClient";

const App = () => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    const routesWithoutHeader = ['/login', '/register'];

    const shouldShowHeader = !routesWithoutHeader.includes(location.pathname);

    return (
        <div className="App">
            {shouldShowHeader && <Header />}
            <Routes>
                {role === 'PARTICIPANT' && (
                    <Route path="/chat" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                )}
                {role === 'PARTICIPANT' && (
                    <Route path="/chat/:id" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
                )}

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
                {role === 'PARTICIPANT' && (
                    <Route path="/loyalty/organizer/:organizerId" element={<LoyaltyClient />} />
                )}
                {role === 'ORGANIZER' && (
                    <Route path="/loyalty/organizer/:organizerId" element={<Loyalty />} />
                )}
                <Route path="/analytics/organizer/:organizerId" element={<Analytics />} />
                <Route path="/event/:eventId" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
                {role === 'PARTICIPANT' && (
                    <Route path="/my-events" element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>} />
                    )}
            </Routes>
        </div>
    );
};

export default App;