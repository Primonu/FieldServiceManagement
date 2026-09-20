import {useEffect, useState} from 'react';
import type {ChangeEvent,FormEvent} from 'react';
import './login.css'
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import axios from 'axios';

function Login(){
    const [show,setShow]=useState(false),[remember,setRemember]=useState(false);
  //const submit=(e:FormEvent)=>{e.preventDefault();setMessage('Sign-in submitted. Connect this form to your authentication API.')};

 const [credentials,setCredentials] = useState({userEmail:'',password:''});
 const [error,setError]=useState('');
 const [loading,setLoading]=useState(false);
 const navigate = useNavigate();

 useEffect(() => {
        if (!error) return;

        const timer = window.setTimeout(() => {
            setError('');
        }, 3000);

        return () => window.clearTimeout(timer);
 }, [error]);

 const handleChange=(e: ChangeEvent<HTMLInputElement>)=>{
    const{name,value}=e.target;
    setCredentials((prev)=>({...prev,[name]:value}));
 };
 const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
        const respone = await API.post('/user_auth/login',credentials);
        const {accessToken, token, role, userResponse, user}=respone.data;
        const authToken = accessToken || token;
        const profile = userResponse || user;

        localStorage.setItem('token',authToken);
        localStorage.setItem('role',role);
        if (profile) {
            localStorage.setItem('user', JSON.stringify(profile));
        } else {
            localStorage.removeItem('user');
        }

        if(role === 'TECHNICIAN'){
            navigate('/Technician/Dashboard');
        }else if(role === 'DISPATCHER'){
            navigate('/Dispatcher/Dashboard');
        }else if(role === 'CUSTOMER'){
            navigate('/Customer/Dashboard');
        }else if(role === 'MANAGER'){
            navigate('/Manager/Dashboard')
        }
    }catch (err:unknown){
        if(axios.isAxiosError(err)){
            setError(
                err.response?.data?.message ||'Invalid email or password. Please try again.'
            );
        }else{
            setError('An unexpected error occurred. Please try again.');
        }
    }finally{
        setLoading(false);
    }
 };
 return( 
 <main className="login-page">
  <section className="hero-panel">
    <div className="hero-bg"/>
    <div className="hero-overlay"/>
   <div className="hero-content">
    <div className="brand">
        <div className="brand-logo"><i className="bi bi-boxes"/>
        </div>
        <span>KEYSTONE</span>
    </div>
    <div className="hero-copy"><h1>Field Service<br/>Management Platform</h1><p>Streamline your field operations,<br/>improve response time and<br/>maximize productivity.</p></div>
   </div>
  </section>
  <section className="login-panel">
    <div className="login-card">
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
   <header className="login-header"><h2>Welcome Back</h2><p>Sign in to your account</p></header>
   <form onSubmit={handleSubmit}>
    <div className="field">
        <label htmlFor="userEmail">Email</label>
        <div className="input-container"><i className="bi bi-envelope"/>
        <input id="userEmail" name="userEmail" type="email" placeholder="Enter your email" autoComplete="email"value={credentials.userEmail}onChange={handleChange} required/></div></div>
    <div className="field">
        <label htmlFor="password">Password</label>
        <div className="input-container"><i className="bi bi-lock"/>
        <input id="password" name="password" type={show ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"value={credentials.password}onChange={handleChange} required/>
        <button type="button" className="password-button" onClick={()=>setShow(!show)}><i className={show?'bi bi-eye-slash':'bi bi-eye'}/></button></div></div>
    <div className="login-options">
        <label className="remember">
            <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span className="custom-checkbox"/><span>Remember me</span></label><button type="button" className="link-button" onClick={()=>navigate('/forgot-password')}>Forgot Password?</button></div>
    <button className="signin-button" type="submit"disabled={loading}>{loading?'Signing in...':'Sign In'}</button>
   </form>
    <p className="register-text">Don't have an account? <button type="button" className="link-button" onClick={()=>navigate('/register')}>Register Here</button></p>
  </div>
  </section>
 </main>
 )
}export default Login;