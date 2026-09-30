import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsBoxArrowRight } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import ActiveTimerComponent from '../../modules/Projects/components/ActiveTimerComponent';
import {
  ADMIN_NAV_GROUPS,
  ADMIN_ACCOUNT_ITEMS,
  isNavItemActive
} from '../layouts/adminNav';

const initialsOf = (value) => {
  if (!value) return 'U';
  const parts = String(value).trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const NavLink = ({ item, collapsed, badge, onNavigate }) => {
  const { pathname } = useLocation();
  const Icon = item.icon;
  const active = isNavItemActive(pathname, item);

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={`group relative flex items-center rounded-lg transition-colors ${
        collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
      } ${
        active
          ? 'bg-white/20 text-white shadow-lg ring-1 ring-inset ring-white/30'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-[#FBB03B]" />
      )}
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
      {badge > 0 && (
        <span
          className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#FBB03B] px-1.5 text-[10px] font-bold text-[#0015AA] ${
            collapsed ? 'absolute right-1 top-1' : 'ml-auto'
          }`}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
};

// Rendered by DashboardLayout. `mobileOpen` drives the drawer under lg,
// `collapsed` drives the icon-only rail on desktop; they are kept separate so
// the two states can never contradict each other.
const Sidebar = ({ mobileOpen, collapsed, onClose, onToggleCollapse }) => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const inquiries = useSelector(state => state.inquiries);
  const profileName = useSelector(state => state.settings?.data?.profile?.name || '');

  if (!token || !user) return null;

  const displayName = profileName || user.name || user.username || 'Admin';
  const displayEmail = user.email || '';

  const badgeFor = (item) => {
    if (!item.badgeKey) return 0;
    return Number(inquiries?.[item.badgeKey]) || 0;
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-gradient-to-b from-[#0015AA] to-[#003366] transition-[width,transform] duration-300 ease-in-out ${
          collapsed ? 'lg:w-16' : 'lg:w-60'
        } w-60 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-white/10 ${
            collapsed ? 'lg:justify-center lg:px-0 px-4' : 'px-4'
          }`}
        >
          <Link
            to="/dashboard"
            onClick={onClose}
            title="VistaForge dashboard"
            className="flex min-w-0 items-center gap-2 text-white drop-shadow"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBB03B] text-sm font-black text-[#0015AA]">
              VF
            </span>
            <span className={`truncate text-base font-bold ${collapsed ? 'lg:hidden' : ''}`}>
              VistaForge
            </span>
          </Link>
        </div>

        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {/* Visibility follows the responsive width of the rail, not the raw
              collapse flag, so a collapsed desktop rail still opens as a full
              labelled drawer on mobile. */}
          <div className={`mb-5 ${collapsed ? 'lg:hidden' : ''}`}>
            <ActiveTimerComponent />
          </div>

          {ADMIN_NAV_GROUPS.map(group => (
            <div key={group.title} className="mb-6 last:mb-0">
              <h3
                className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/50 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group.title}
              </h3>
              <div
                className={`mb-3 hidden border-t border-white/10 ${
                  collapsed ? 'lg:block' : ''
                }`}
              />
              <nav className="flex flex-col gap-1">
                {group.items.map(item => (
                  <NavLink
                    key={item.path}
                    item={item}
                    collapsed={collapsed}
                    badge={badgeFor(item)}
                    onNavigate={onClose}
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Account */}
        <div className="shrink-0 border-t border-white/10 p-3">
          {ADMIN_ACCOUNT_ITEMS.map(item => (
            <NavLink
              key={item.path}
              item={item}
              collapsed={collapsed}
              badge={0}
              onNavigate={onClose}
            />
          ))}

          <button
            type="button"
            onClick={() => (collapsed ? onToggleCollapse() : setUserMenuOpen(open => !open))}
            aria-expanded={!collapsed ? userMenuOpen : undefined}
            className={`mt-2 flex w-full items-center rounded-lg py-2 transition-colors hover:bg-white/10 ${
              collapsed ? 'justify-center px-2' : 'gap-3 px-3'
            }`}
            title={collapsed ? displayName : undefined}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBB03B] text-xs font-bold text-[#0015AA]">
              {initialsOf(displayName)}
            </span>
            {!collapsed && (
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium text-white">
                  {displayName}
                </span>
                <span className="block truncate text-xs text-white/60">{displayEmail}</span>
              </span>
            )}
          </button>

          {!collapsed && userMenuOpen && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <BsBoxArrowRight size={18} className="shrink-0" />
              Log Out
            </button>
          )}

          {collapsed && (
            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              aria-label="Log Out"
              className="mt-1 flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <BsBoxArrowRight size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile drawer scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
