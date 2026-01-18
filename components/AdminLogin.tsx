import React, { useState } from 'react';

interface AdminLoginProps {
    onLogin: (token: string, username: string) => void;
    onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(data.token, data.user.username);
                onClose();
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="glass p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl shadow-blue-500/10">
                <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>
                {error && <p className="text-red-400 mb-4 bg-red-500/10 p-3 rounded-xl text-sm font-bold border border-red-500/20">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm font-bold uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm font-bold uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-4 mt-8">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-slate-300 hover:bg-white/5 font-bold transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
