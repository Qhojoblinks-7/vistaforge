import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import AdminTopbar from './AdminTopbar';

const COLLAPSE_KEY = 'adminSidebarCollapsed';
const DESKTOP_BREAKPOINT = 1024; // Tailwind's `lg`

const readCollapsed = () => {
  if (typeof window === 'undefined') return false;
  const saved = window.localStorage.getItem(COLLAPSE_KEY);
  return saved === null ? false : saved === 'true';
};

const DESKTOP_QUERY = `(min-width: ${DESKTOP_BREAKPOINT}px)`;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event) => setIsDesktop(event.matches);
    media.addEventListener('change', onChange);
    setIsDesktop(media.matches);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
};

// Admin shell: fixed sidebar + sticky topbar + scrolling content area.
//
// `mobileOpen` (drawer, below lg) and `collapsed` (icon rail, lg and up) are
// deliberately separate pieces of state. The previous version derived the
// desktop content offset from the mobile drawer flag, so a persisted
// "closed" value rendered the sidebar visible but left the content underneath
// it. Deriving both from distinct state makes that combination impossible.
const DashboardLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setCollapsed(readCollapsed());
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, String(next));
      return next;
    });
  }, []);

  // Navigating on mobile should dismiss the drawer; leaving it open over the
  // new page is disorienting and traps the scroll.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Growing past the breakpoint reveals the permanent rail, so the drawer must
  // not stay latched open behind it.
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  // The collapsed rail only exists at lg and up. Passing `collapsed && isDesktop`
  // keeps the mobile drawer fully labelled even when the desktop preference is
  // stored as collapsed.
  const railCollapsed = collapsed && isDesktop;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        mobileOpen={mobileOpen}
        collapsed={railCollapsed}
        onClose={() => setMobileOpen(false)}
        onToggleCollapse={toggleCollapsed}
      />

      <div className={`transition-[padding] duration-300 ease-in-out ${
        collapsed ? 'lg:pl-16' : 'lg:pl-60'
      }`}>
        <AdminTopbar
          onOpenSidebar={() => setMobileOpen(true)}
          onToggleCollapse={toggleCollapsed}
          collapsed={railCollapsed}
        />

        {/* Pages own their own page-level padding (py-8 + max-w-7xl), so the
            shell only supplies horizontal gutters. */}
        <main id="main-content" className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
