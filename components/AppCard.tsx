
import React from 'react';
import { BydApp } from '../types';


interface AppCardProps {
  app: BydApp;
  isAdmin?: boolean;
  onEdit?: (app: BydApp) => void;
  onDelete?: (id: string) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, isAdmin, onEdit, onDelete }) => {
  const statusColor = app.status === 'Verified' ? 'text-green-400 bg-green-400/10' :
    app.status === 'Pending' ? 'text-blue-400 bg-blue-400/10' :
      'text-red-400 bg-red-400/10';

  const handleDownload = () => {
    window.location.href = `/api/apps/${app.id}/download`;
  };

  return (
    <div
      onClick={handleDownload}
      className="glass rounded-[2rem] p-6 hover:translate-y-[-8px] transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col h-full text-left"
      dir="ltr"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {isAdmin && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(app);
              }}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-xl transition-colors backdrop-blur-md"
              title="Edit App"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this app?')) {
                  onDelete?.(app.id);
                }
              }}
              className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-colors backdrop-blur-md"
              title="Delete App"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </>
        )}
        <div className="p-2 bg-white/5 rounded-xl">
          <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
        </div>
      </div>

      <div className="flex gap-5 mb-6 items-start">
        <div className="relative w-16 h-16 shrink-0">
          <img
            src={app.iconUrl}
            alt={app.name}
            className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10"
          />
          <div className="absolute inset-0 bg-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="flex-1">
          <div className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 ${statusColor}`}>
            {app.status}
          </div>
          <h3 className="text-xl font-extrabold text-white leading-tight group-hover:text-blue-400 transition-colors">{app.name}</h3>
        </div>
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">
        {app.description}
      </p>

      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest pt-5 border-t border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
          <span>{app.size}</span>
        </div>
        <div className="flex items-center gap-1 hover:text-blue-400 transition-colors text-xs text-blue-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Download Now
        </div>
        <span dir="ltr">v{app.version}</span>
      </div>
    </div>
  );
};

export default AppCard;
