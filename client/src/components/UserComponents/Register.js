import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./profile.css";
import {userRegister} from "../../service/user-service.js";

const initialValue = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
}


const RegisterComponent = () => {

    const [formData, setFormData] = useState(initialValue);
    const { username, password, repeatPassword, firstName, lastName, email  } = formData;
    const [errorMessage, setErrorMessage] = useState('');

    let navigate = useNavigate();

    const onValueChange = async (e) => {
        console.log({[e.target.name]: e.target.value});
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const registerUserDetails = async() => {
        if (formData.password !== formData.repeatPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if (formData.password.includes(formData.username) || formData.password.includes(formData.email)) {
            setErrorMessage('Password cannot contain username or email.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Invalid email format.');
            return;
        }

        setErrorMessage('');
        formData.registration_date_time = new Date().toISOString();
        formData.reputation = 0;

        const response = await userRegister(formData);
        if(response.responseCode === 200) {
            window.alert(response.responseMessage);
            navigate(`/user/login`);
        } else {
            setErrorMessage(response.responseMessage);
            window.alert(response.responseMessage);
        }
    }

    return(
        <div className="container">
            <div className="row justify-content-center" style={{margin: "50px"}}>
                <div className="col-md-8">
                    <div className="card-group mb-0">
                        <div className="card p-4">
                            <div className="card-body">

                                <h1>Register </h1>
                                <p className="text-muted">Register your account</p>
                                <div className="input-group mb-3">
                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                    <input type="text" className="form-control" placeholder="First Name" onChange={(e) => onValueChange(e)} name='firstName' value={firstName} id="firstName" />
                                </div>
                                <div className="input-group mb-4">
                                    <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                    <input type="text" className="form-control" placeholder="Last Name" onChange={(e) => onValueChange(e)} name='lastName' value={lastName} id="lastName"/>

                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                    <input type="text" className="form-control" placeholder="Username" onChange={(e) => onValueChange(e)} name='username' value={username} id="username" />
                                </div>
                                <div className="input-group mb-4">
                                    <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                    <input type="password" className="form-control" placeholder="Password" onChange={(e) => onValueChange(e)} name='password' value={password} id="password"/>
                                </div>
                                <div className="input-group mb-4">
                                    <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                    <input type="password" className="form-control" placeholder="Repeat Password" onChange={(e) => onValueChange(e)} name='repeatPassword' value={repeatPassword} id="repeatPassword"/>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                    <input type="text" className="form-control" placeholder="Email" onChange={(e) => onValueChange(e)} name='email' value={email} id="email" />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <button type="button" className="btn btn-primary px-4" onClick={() => registerUserDetails()}>Register</button>
                                    </div>
                                </div>
                                <div>
                                    {errorMessage !== ''? <span style={{"color": "red"}}>{errorMessage}</span> : <span></span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default RegisterComponent;