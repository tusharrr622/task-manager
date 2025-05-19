import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import '../stylesheets/Login.css'
import { UserContext } from "../UserContext";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo, setToken } = useContext(UserContext);

    function handleSubmit(ev) {
        ev.preventDefault();
        const data = {
            username,
            password
        }
        console.log("API BASE URL:", process.env.REACT_APP_API_BASE_URL);


        axios.post(`${process.env.REACT_APP_API_BASE_URL}login`, data).then(Response => {
            const token = Response.data.token;
            setUserInfo(Response.data);
            setToken(token)
            setRedirect(true);
            console.log(Response.data);
        })
    }

    if (redirect) {
        return <Navigate to={'/tasks'} />
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" className='email' placeholder='admin@gmail.com' value={username} onChange={ev => setUsername(ev.target.value)} />
            <label>Password</label>
            <input type="password" className='password' placeholder='Enter your password' value={password} onChange={ev => setPassword(ev.target.value)} />
            <input type="submit" value="Login" className='login' />
            <p>
                Register here <Link to={'/'}><button>Register</button></Link>
            </p>
        </form>
    )
}

export default Login