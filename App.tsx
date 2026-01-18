import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AppCard from './components/AppCard';
import AdminLogin from './components/AdminLogin';
import { BydApp, AiAnalysisResult, AppCategory } from './types';
import { analyzeAppMetadata } from './services/geminiService';

const App: React.FC = () => {
  const [apps, setApps] = useState<BydApp[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [showLogin, setShowLogin] = useState(false);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<BydApp | null>(null);

  const filteredApps = selectedCategory
    ? apps.filter(app => app.category === selectedCategory)
    : apps;

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      setApps(data);
    } catch (error) {
      console.error('Failed to fetch apps', error);
    }
  };

  const handleLogin = (token: string, user: string) => {
    setAuthToken(token);
    setUsername(user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUsername(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  };

  const handleDeleteApp = async (id: string) => {
    try {
      const response = await fetch(`/api/apps/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        fetchApps();
      } else {
        alert('Failed to delete app');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting app');
    }
  };

  const handleUpdateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp || !authToken) return;

    try {
      const response = await fetch(`/api/apps/${editingApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(editingApp)
      });

      if (response.ok) {
        setEditingApp(null);
        fetchApps();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Update failed:', errorData);
        alert(`Update failed: ${errorData.error || 'Server error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error updating app');
    }
  };

  // Simplified version generator for demo since backend doesn't extract it yet
  // Ideally, backend would parse APK to get package info
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && authToken) {
      setIsUploading(true);

      try {
        // First Run AI Analysis
        setIsAnalyzing(true);
        const aiResult = await analyzeAppMetadata(file.name.replace('.apk', ''), 'Uploaded via ByHub');
        setAnalysis(aiResult);
        setIsAnalyzing(false);

        // Upload to Backend
        const formData = new FormData();
        formData.append('apk', file);
        formData.append('name', file.name.replace('.apk', ''));
        formData.append('version', '1.0.' + Math.floor(Math.random() * 10)); // Mocking version extraction
        formData.append('developer', username || 'Admin');

        // Ensure category is assigned correctly
        const category = selectedCategory || 'Utilities';
        formData.append('category', category);

        formData.append('description', 'Uploaded to BYD App Hub');
        formData.append('size', `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        formData.append('iconUrl', `https://api.dicebear.com/7.x/identicon/svg?seed=${file.name}`);

        const response = await fetch('/api/apps/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        });

        if (response.ok) {
          fetchApps(); // Refresh list
        } else {
          alert('Upload failed');
        }
      } catch (error) {
        console.error(error);
        alert('Error uploading file');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen" dir="ltr">
      <Sidebar
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="flex-1 ml-64 min-h-screen relative">
        <section className="relative h-80 overflow-hidden flex items-center px-12 border-b border-white/5">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=2000"
              alt="BYD Car Interior"
              className="w-full h-full object-cover car-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          <div className="relative z-10 w-full max-w-4xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Official Developer Portal
            </div>
            <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Create the Future of <br /><span className="text-blue-500 text-glow">BYD DiLink</span>
            </h2>
            <div className="flex gap-4">
              {authToken ? (
                <label className="byd-gradient px-8 py-4 rounded-2xl font-bold text-white cursor-pointer shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Upload New APK
                  <input type="file" accept=".apk" className="hidden" onChange={handleFileUpload} />
                </label>
              ) : (
                <button onClick={() => setShowLogin(true)} className="byd-gradient px-8 py-4 rounded-2xl font-bold text-white cursor-pointer shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center gap-3">
                  Admin Login
                </button>
              )}

              <button className="px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
                View Guidelines
              </button>

              {authToken && (
                <button onClick={handleLogout} className="px-4 py-4 rounded-2xl font-bold text-red-400 bg-white/5 border border-white/10 hover:bg-red-500/10 transition-all">
                  Logout
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="p-12 space-y-12">


          {/* Ready to Upload Zone - Only for Admins */}
          {authToken && (
            <section className="glass rounded-[2.5rem] p-10 border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all group flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Upload?</h3>
              <p className="text-slate-400 max-w-sm">Drag and drop your APK here or click to browse. We'll automatically start the Gemini AI security scan.</p>
              <input type="file" accept=".apk" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
            </section>
          )}

          {isUploading && (
            <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center border-blue-500/30">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Uploading Build</h3>
              <p className="text-slate-400">Syncing with BYD Global Hub...</p>
            </div>
          )}

          {analysis && (
            <div className="glass rounded-3xl p-8 border-l-4 border-l-blue-500 relative group overflow-hidden text-left">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-white">AI Safety Report</h3>
                    <p className="text-slate-400 text-sm">Real-time analysis by Gemini for BYD Standards</p>
                  </div>
                </div>
                <button onClick={() => setAnalysis(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Safety Rating</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-green-400">{analysis.securityScore}%</span>
                    <span className="text-green-400/50 text-sm mb-2 font-bold">Secure</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: `${analysis.securityScore}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">DiLink Compatibility</p>
                  <p className="text-4xl font-black text-blue-400">{analysis.compatibility}</p>
                  <p className="text-slate-400 text-xs">Based on latest DiLink specs</p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Recommendations</p>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-xs text-slate-300">
                        <span className="text-blue-500">▶</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black text-white">{selectedCategory || 'Application Library'}</h3>
                <p className="text-slate-500 mt-1">Manage your certified and pending vehicle builds.</p>
              </div>
              <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all">All Builds</button>
                <button className="px-4 py-2 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all">In Review</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filteredApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  isAdmin={!!authToken}
                  onDelete={handleDeleteApp}
                  onEdit={setEditingApp}
                />
              ))}
              {filteredApps.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500">
                  <p>No apps found in {selectedCategory || 'library'}. {authToken && 'Upload one to get started!'}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {isAnalyzing && (
          <div className="fixed bottom-12 right-12 glass p-6 rounded-3xl border-blue-500/50 flex items-center gap-4 shadow-2xl shadow-blue-500/20 z-50">
            <div className="relative">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-20"></div>
            </div>
            <span className="font-bold text-white italic">Gemini AI Audit...</span>
          </div>
        )}

        {showLogin && (
          <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />
        )}

        {editingApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingApp(null)}></div>
            <div className="relative glass w-full max-w-xl p-8 rounded-[2.5rem] border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-white">Edit App</h3>
                <button onClick={() => setEditingApp(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleUpdateApp} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">App Name</label>
                    <input
                      type="text"
                      value={editingApp.name}
                      onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Category</label>
                    <select
                      value={editingApp.category}
                      onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value as AppCategory })}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                    >
                      {Object.values(AppCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Description</label>
                  <textarea
                    value={editingApp.description}
                    onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Version</label>
                    <input
                      type="text"
                      value={editingApp.version}
                      onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Size</label>
                    <input
                      type="text"
                      value={editingApp.size}
                      onChange={(e) => setEditingApp({ ...editingApp, size: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 byd-gradient py-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingApp(null)}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-400 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};



export default App;
