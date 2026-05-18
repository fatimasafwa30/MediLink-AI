import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const NavBar = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Emergency AI', path: '/emergency' },
    { name: 'Health Twin', path: '/health-twin' },
    { name: 'Live Map', path: '/map' },
    { name: 'Drone Support', path: '/drones' },
    { name: 'Medicine Scanner', path: '/scanner' },
    { name: 'Dashboard', path: '/dashboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[9000] glass border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="text-accent animate-heartbeat" size={20} />
          </div>
          <span className="font-orbitron font-bold text-xl text-text">Mama<span className="text-accent">Care</span></span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `font-orbitron text-sm font-semibold transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-text'}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
