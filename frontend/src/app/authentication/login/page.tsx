"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import Image from "next/image";
import '../../styles.css'
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8000/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Esto es clave para las cookies
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            // Almacena los tokens
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            // Configura el header de autorización por defecto
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

            // Redirecciona
            router.push('/');

        } catch (err) {
            setError('Invalid credentials');
            console.error('Login error:', err);
        }
    };

    return (
        <div className='main-form-container'>
            <ToastContainer />
            {/* Header */}
            <Image
                onClick={() => { router.push('/'); }}
                className="logo-clickable"
                src="/logo-interfaz.svg"
                alt="interfaz.js logo"
                width={280}
                height={58}
                priority
            />

            {/* Create Section */}

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
            </div>
        </div>
            );
};

            export default LoginPage; 