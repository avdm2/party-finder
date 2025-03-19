import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import CreateProfile from "./components/CreateProfile";
import UserProfile from "./components/UserProfile";
import OrganizerProfile from "./services/OrganizerProfile";
import FindEvent from "./components/FindEvent";
import Auth from "./services/Auth";


function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/create-profile" element={<CreateProfile />} />
                    <Route path="/profile/:username" element={<UserProfile />} /> {/* Маршрут для страницы профиля */}
                    <Route path="/login" element={<Auth isRegister={false} />} />
                    <Route path="/register" element={<Auth isRegister={true} />} />
                    <Route path="/organizer-profile" element={<OrganizerProfile />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                    <Route path="/find-event" element={<FindEvent />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;