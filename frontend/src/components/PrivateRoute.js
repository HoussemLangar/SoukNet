import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== role) {
        return <Navigate to="/login" />;
    }
    return children; 
};

export default PrivateRoute;