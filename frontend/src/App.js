import React from "react";
import HeroSection from "./components/HeroSection";
import HomePage from "./components/HomePage";


const App = ({ user, setUser }) => {
    return (
        <div>
            <HeroSection />
            <HomePage user={user} setUser={setUser}  />
        </div>
    );
};

export default App;
