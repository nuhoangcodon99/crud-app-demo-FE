import { useContext, useEffect, useState } from 'react'
import { loginApi } from '../services/UserService'
import './LoginDesign.scss'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    const [loadingAPI, setLoadingAPI] = useState(false);

    const navigate = useNavigate();

    const { loginContext } = useContext(UserContext)

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, [])

    //Generate token
    let rand = function () {
        return Math.random().toString(36).substr(2); // remove `0.`
    };

    let token = function () {
        return rand() + rand(); // to make it longer
    };
    let randomToken = token();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Missing email or password")
            return;
        }
        setLoadingAPI(true);
        const res = await loginApi(email, password);
        if (res && res.token) {
            loginContext(email, randomToken);
            toast.success("Login successfully")
            navigate("/");
        } else {
            //Error occured
            if (res && res.status === 400) {
                toast.error("Login failed")
            }
        }
        setLoadingAPI(false);
    }

    return (
        <div className="login-container">
            <h1 className='header'>Log in</h1>
            <p className="text">Email or Username</p>
            <div className='input-space'>
                <input
                    type="text"
                    className='input-box'
                    placeholder='Email or username'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <div className='input-box'>
                    <input
                        type={isShowPassword == false ? "password" : "text"}
                        placeholder='Password'
                        value={password}
                        className='input-password'
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <i
                        className={isShowPassword === false ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                    ></i>
                </div>


            </div>
            <button
                className={(email && password && !loadingAPI) ? "active" : ""}
                disabled={(email && password && !loadingAPI) ? false : true}
                onClick={() => handleLogin()}
            >{loadingAPI && <i className='fa-solid fa-sync fa-spin'></i>} Login</button>
            <p className='back'><Link to={'/'}><i className="fa-solid fa-arrow-left"></i> Go back</Link></p>
        </div>
    )
}

export default Login