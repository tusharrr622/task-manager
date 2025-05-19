import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import '../stylesheets/Register.css'

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    function handleSubmit(ev) {
        ev.preventDefault();
        const data = {
            username,
            password
        }
        axios.post(`${process.env.REACT_APP_API_BASE_URL}register`, data, {
            withCredentials: true
        }).then(Response => {
            setRedirect(true);
            console.log(Response.data);
        })
    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" className='email' placeholder='admin@gmail.com' value={username} onChange={ev => setUsername(ev.target.value)} />
            <label>Password</label>
            <input type="password" className='password' placeholder='Enter your password' value={password} onChange={ev => setPassword(ev.target.value)} />
            <input type="submit" value="Register" className='register' />
            <p>
                Already have an account? <Link to={'/login'}><button>Login here</button></Link>
            </p>
        </form>
    )
}

export default Register