import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  BsHouse,
  BsBriefcase,
  BsClock,
  BsPeople,
  BsReceipt,
  BsBarChart,
  BsGear,
  BsBoxArrowRight,
  BsEnvelope
} from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import ActiveTimerComponent from '../../modules/Projects/components/ActiveTimerComponent';

// Sidebar should only be rendered for authenticated users
// This component enforces strict authentication requirements
const Sidebar = () => {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { newInquiryCount } = useSelector(state => state.inquiries);

  // Strict authentication check - sidebar should never render without valid auth
  if (!token || !user) {
    return null;
  }

  const navigationGroups = [
    {
      title: 'Work Focus',
      items: [
        { label: 'Dashboard', icon: BsHouse, path: '/dashboard' },
        { label: 'Projects', icon: BsBriefcase, path: '/admin/projects' },
        { label: 'Time Logs', icon: BsClock, path: '/timelogs' },
        {
          label: 'Inquiries',
          icon: BsEnvelope,
          path: '/inquiries',
          badge: newInquiryCount > 0 ? newInquiryCount : null
        }
      ]
    },
    {
      title: 'Business',
      items: [
        { label: 'Clients', icon: BsPeople, path: '/clients' },
        { label: 'Invoices', icon: BsReceipt, path: '/invoices' },
        { label: 'Analytics', icon: BsBarChart, path: '/analytics' }
      ]
    }
  ];

  const userConfigItems = [
    { label: 'My Account', icon: BsGear, path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-gradient-to-b from-[#0015AA] to-[#003366] border-r border-white/20 shadow-2xl flex flex-col backdrop-blur-sm">
      {/* Logo/Branding */}
      <div className="text-xl font-bold mb-8 text-center py-6 border-b border-white/20">
        <Link to="/dashboard" className="text-white hover:text-[#FBB03B] transition-colors drop-shadow-lg">
          Freespec
        </Link>
      </div>

      {/* Active Timer Component */}
      <div className="mb-6 px-4">
        <ActiveTimerComponent />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-4">
        {navigationGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-white/70 text-xs uppercase tracking-wider mb-3 px-2 font-semibold drop-shadow-sm">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      isActive(item.path)
                        ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30'
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md backdrop-blur-sm border border-transparent hover:border-white/20'
                    }`}
                  >
                    <Icon className="mr-3 drop-shadow-sm" size={18} />
                    <span className="text-sm font-medium drop-shadow-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-[#FBB03B] text-[#0015AA] text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-lg animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Config (Fixed to bottom) */}
      <div className="border-t border-white/20 pt-4 px-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-[#FBB03B] rounded-full flex items-center justify-center text-[#0015AA] font-semibold shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate drop-shadow-sm">{user?.name || 'User'}</p>
            <p className="text-xs text-white/70 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        {userConfigItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 mb-2 ${
                isActive(item.path)
                  ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30'
                  : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md backdrop-blur-sm border border-transparent hover:border-white/20'
              }`}
            >
              <Icon className="mr-3 drop-shadow-sm" size={18} />
              <span className="text-sm font-medium drop-shadow-sm">{item.label}</span>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 w-full text-left text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/20"
        >
          <BsBoxArrowRight className="mr-3 drop-shadow-sm" size={18} />
          <span className="text-sm font-medium drop-shadow-sm">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;