import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const { logout, user, isAdmin, isMentor } = useAuth();

    return (
        <nav className="glass sticky top-0 z-[100] px-6 md:px-12 py-4 flex justify-between items-center rounded-b-3xl">
            <div className="flex items-center gap-8">
                <div className="font-serif text-2xl text-forest-dark font-bold tracking-tighter">
                    Consent<span className="text-amber">Flow</span>
                </div>
                
                <div className="hidden md:flex items-center gap-1">
                    <NavLink 
                        to="/dashboard" 
                        end
                        className={({ isActive }) => `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-forest/10 text-forest' : 'text-text-muted hover:text-forest hover:bg-forest/5'}`}
                    >
                        Dashboard
                    </NavLink>
                    {isAdmin && (
                         <NavLink 
                         to="/dashboard/users" 
                         className={({ isActive }) => `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-forest/10 text-forest' : 'text-text-muted hover:text-forest hover:bg-forest/5'}`}
                     >
                         Users
                     </NavLink>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-xs font-bold text-forest uppercase tracking-widest">{user?.role}</span>
                    <span className="text-sm font-medium text-text-body">{user?.name}</span>
                </div>
                
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-forest to-sage flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <button 
                    onClick={logout}
                    className="ml-2 p-2 flex items-center gap-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors group border border-transparent hover:border-red-100"
                    title="Sign Out"
                >
                    <span className="font-bold text-sm hidden md:inline">Logout</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
