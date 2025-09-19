"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import Image from "next/image";
import '../../styles.css';
import api from '../../lib/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [recoverPassword, setRecoverPassword] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username) return toast.error('Username is mandatory');
        if (!password) return toast.error('Password is mandatory');

        try {
            const response = await fetch('http://localhost:8000/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
            router.push('/authentication/confirmation');
        } catch (err) {
            setError('Invalid credentials');
            console.error('Login error:', err);
            setRecoverPassword(true);
        }
    };

    const handlePasswordRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8000/password/reset/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            toast.success('Password recovery email sent.');
        } catch (err) {
            setError('Invalid email');
            console.error('Request error:', err);
        }
    };

    return (
        <div className='main-form-container'>
            <ToastContainer />
            <Image
                onClick={() => { router.push('/'); }}
                className="logo-clickable"
                src="/logo-interfaz.svg"
                alt="interfaz.js logo"
                width={280}
                height={58}
                priority
            />

            <div className="form-wrapper">
                <form className="volunteer-form" onSubmit={handleSubmit}>
                    <div className="form-header-inner">
                        <h3 className="form-title">Sign In</h3>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="form-group">
                            <input
                                className="form-label"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-label"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="submit-button">
                                Login
                            </button>
                        </div>
                    </div>
                </form>

                {recoverPassword && (
                    <form className="volunteer-form" onSubmit={handlePasswordRecovery}>
                        <div className="form-header-inner">
                            <h3 className="form-title">Recover password</h3>
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-label"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="submit-button">
                                    Recover
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
