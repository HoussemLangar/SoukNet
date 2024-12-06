import React from 'react';
import { useLocation } from 'react-router-dom'; 
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ user, setUser, onLogout, children }) => {
    const location = useLocation(); 
    const hideComponents = ['/dashboard']; 

    const shouldHideComponents = hideComponents.some(route => location.pathname.startsWith(route));

    return (
        <div>
            {!shouldHideComponents && <Navbar user={user} onLogout={onLogout} />}
            {children}
            {!shouldHideComponents && <Footer />}
        </div>
    );
};

export default Layout;
