import React, {useState} from "react";
import "./login.css";
import {useNavigate} from "react-router-dom";
import {userLogin} from "../../service/user-service.js";

const initialValue = {
    username: '',
    password: ''
}
const LoginComponent = (props) => {

    const [user, setUser] = useState(initialValue);
    const { username, password } = user;
    const [errorMessage, setErrorMessage] = useState('');

    let navigate = useNavigate();

    const onValueChange = (e) => {
        console.log({[e.target.name]: e.target.value});
        setUser({...user, [e.target.name]: e.target.value})
    }

    const addUserDetails = async() => {
        console.log(user)
        const response = await userLogin(user);
        console.log(response);
        if(response.responseCode === 200) {
            console.log(response.responseMessage._id);
            props.setUser(response.responseMessage);
            navigate(`/home`);
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
                                <h1>Login</h1>
                                <p className="text-muted">Sign In to your account</p>
                                <div className="input-group mb-3">
                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                    <input type="text" className="form-control" placeholder="Username" onChange={(e) => onValueChange(e)} name='username' value={username} id="username" />
                                </div>
                                <div className="input-group mb-4">
                                    <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                    <input type="password" className="form-control" placeholder="Password" onChange={(e) => onValueChange(e)} name='password' value={password} id="password"/>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <button type="button" className="btn btn-primary px-4" onClick={() => addUserDetails()}>Login</button>
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
export default LoginComponent;