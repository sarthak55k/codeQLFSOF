import React, { useEffect } from 'react';
import './welcome.css';
import {Link, useNavigate} from "react-router-dom";

const WelcomePage  = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        if(props.user) {
            navigate('/home');
        }
    },[])
    return (
            <div className="welcome-container">
                <h1>Welcome to Fake Stack Over Flow!</h1>
                <p>Please select an option:</p>
                <Link to="/user/register" className="action-button" id="register-user">Register as a new user
                </Link>
                <Link to="/user/login" className="action-button" id="login-user">Login as an existing user
                </Link>
                <Link to="/home" className="action-button" id="guest-user">Continue as a guest user
                </Link>
            </div>
        );
}

export default WelcomePage;
