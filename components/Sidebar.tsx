
import React from 'react';
import { AppCategory } from '../types';

interface SidebarProps {
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="w-64 h-full glass border-r border-white/5 p-8 flex flex-col fixed left-0 top-0 z-50 text-left" dir="ltr">
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 byd-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 border border-white/20 shrink-0">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 21h22L12 2zm0 3.5L18.5 19h-13L12 5.5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white leading-none">BYD</h1>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest text-nowrap">App Hub</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-5">Main Menu</div>
        <NavItem
          icon={<HomeIcon />}
          label="All Apps"
          active={activeCategory === null}
          onClick={() => onSelectCategory(null)}
        />
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2 px-5">Categories</div>
        <NavItem
          icon={<SocialIcon />}
          label="Entertainment"
          active={activeCategory === AppCategory.ENTERTAINMENT}
          onClick={() => onSelectCategory(AppCategory.ENTERTAINMENT)}
        />
        <NavItem
          icon={<MapIcon />}
          label="Navigation"
          active={activeCategory === AppCategory.NAVIGATION}
          onClick={() => onSelectCategory(AppCategory.NAVIGATION)}
        />
        <NavItem
          icon={<AnalyticsIcon />}
          label="Utilities"
          active={activeCategory === AppCategory.UTILITIES}
          onClick={() => onSelectCategory(AppCategory.UTILITIES)}
        />
        <NavItem
          icon={<GameIcon />}
          label="Smart Home"
          active={activeCategory === AppCategory.SMART_HOME}
          onClick={() => onSelectCategory(AppCategory.SMART_HOME)}
        />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group ${active ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'} transition-colors shrink-0`}>{icon}</div>
    <span className="font-bold text-sm">{label}</span>
  </button>
);

const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SocialIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GameIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const MapIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;
const ShieldIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const AnalyticsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

export default Sidebar;
