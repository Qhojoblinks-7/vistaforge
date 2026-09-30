import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BsList,
  BsSearch,
  BsBell,
  BsChevronDown,
  BsGear,
  BsPerson,
  BsBoxArrowRight,
  BsArrowBarLeft
} from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { getRouteMeta } from './adminNav';

const initialsOf = (value) => {
  if (!value) return 'U';
  const parts = String(value).trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const AdminTopbar = ({ onOpenSidebar, onToggleCollapse, collapsed }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const profileName = useSelector(state => state.settings?.data?.profile?.name || '');
  const newInquiries = useSelector(
    state => state.inquiries?.analytics?.newInquiries || 0
  );

  const meta = getRouteMeta(pathname);

  const displayName = profileName || user?.name || user?.username || 'Admin';
  const displayEmail = user?.email || '';

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    searchRef.current?.focus();
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="-ml-1 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
      >
        <BsList size={22} />
      </button>

      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:block"
      >
        <BsArrowBarLeft size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold leading-tight text-gray-900">
          {meta.title}
        </h1>
        {meta.description && (
          <p className="hidden truncate text-xs text-gray-500 sm:block">{meta.description}</p>
        )}
      </div>

      {/* Global search: expands inline on small screens, always visible from md up */}
      <div className="relative hidden md:block">
        <BsSearch
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search…"
          aria-label="Search the dashboard"
          className="w-48 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#0015AA] focus:bg-white focus:ring-2 focus:ring-[#0015AA]/20 lg:w-64"
        />
      </div>

      <button
        type="button"
        onClick={() => setSearchOpen(open => !open)}
        aria-label="Search"
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
      >
        <BsSearch size={20} />
      </button>

      {searchOpen && (
        <div className="absolute inset-x-0 top-16 border-b border-gray-200 bg-white p-3 shadow-lg md:hidden">
          <div className="relative">
            <BsSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search…"
              aria-label="Search the dashboard"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0015AA] focus:bg-white focus:ring-2 focus:ring-[#0015AA]/20"
            />
          </div>
        </div>
      )}

      <Link
        to="/inquiries"
        aria-label={`Notifications, ${newInquiries} unread`}
        className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <BsBell size={20} />
        {newInquiries > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#FBB03B] px-1 text-[10px] font-bold text-[#0015AA]">
            {newInquiries > 9 ? '9+' : newInquiries}
          </span>
        )}
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(open => !open)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-gray-100"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FBB03B] to-[#E0A030] text-xs font-bold text-[#0015AA]">
            {initialsOf(displayName)}
          </span>
          <span className="hidden min-w-0 text-left sm:block">
            <span className="block truncate text-sm font-medium text-gray-900">
              {displayName}
            </span>
          </span>
          <BsChevronDown
            size={14}
            className={`hidden text-gray-400 transition-transform sm:block ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="truncate text-xs text-gray-500">{displayEmail}</p>
            </div>

            <Link
              to="/settings"
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <BsPerson size={16} className="text-gray-400" />
              Profile
            </Link>
            <Link
              to="/settings"
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <BsGear size={16} className="text-gray-400" />
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <BsBoxArrowRight size={16} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminTopbar;
