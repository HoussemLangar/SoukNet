// src/authService.js

const register = async (email, password, token) => {
    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, token }),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json(); 
    } catch (error) {
        console.error('Error during registration:', error);
        throw error; 
    }
};

export { register };
