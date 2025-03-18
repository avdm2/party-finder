import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateProfile from "./components/CreateProfile";
import UserProfile from "./components/UserProfile";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/create-profile" element={<CreateProfile />} />
                    <Route path="/profile/:username" element={<UserProfile />} /> {/* Маршрут для страницы профиля */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;