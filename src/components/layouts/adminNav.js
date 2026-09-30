import {
  BsHouse,
  BsBriefcase,
  BsClock,
  BsEnvelope,
  BsPeople,
  BsReceipt,
  BsBarChart,
  BsGear
} from 'react-icons/bs';

// Single source of truth for the admin shell: the sidebar renders
// ADMIN_NAV_GROUPS and the topbar renders the title/description for the active
// route. App.jsx groups the admin routes behind DashboardLayout itself, so a
// page cannot pick up the public marketing header by omission.
//
// Paths are deliberately different from the ones the pages use internally
// (`/admin/projects` is the management page, `/projects/:id` is the detail
// view), which is why each item carries an explicit `matchPaths` list instead
// of relying on prefix matching.
export const ADMIN_NAV_GROUPS = [
  {
    title: 'Work Focus',
    items: [
      {
        label: 'Dashboard',
        icon: BsHouse,
        path: '/dashboard',
        matchPaths: ['/dashboard']
      },
      {
        label: 'Projects',
        icon: BsBriefcase,
        path: '/admin/projects',
        matchPaths: ['/admin/projects', '/projects']
      },
      {
        label: 'Time Logs',
        icon: BsClock,
        path: '/timelogs',
        matchPaths: ['/timelogs']
      },
      {
        // badgeKey resolves against state.inquiries; see badgeValueFor().
        label: 'Inquiries',
        icon: BsEnvelope,
        path: '/inquiries',
        matchPaths: ['/inquiries'],
        badgeKey: 'newInquiries'
      }
    ]
  },
  {
    title: 'Business',
    items: [
      { label: 'Clients', icon: BsPeople, path: '/clients', matchPaths: ['/clients'] },
      { label: 'Invoices', icon: BsReceipt, path: '/invoices', matchPaths: ['/invoices'] },
      { label: 'Analytics', icon: BsBarChart, path: '/analytics', matchPaths: ['/analytics'] }
    ]
  }
];

export const ADMIN_ACCOUNT_ITEMS = [
  { label: 'My Account', icon: BsGear, path: '/settings', matchPaths: ['/settings'] }
];

const ALL_NAV_ITEMS = [...ADMIN_NAV_GROUPS, { title: 'Account', items: ADMIN_ACCOUNT_ITEMS }]
  .reduce((acc, group) => acc.concat(group.items), []);

export const isNavItemActive = (pathname, item) => {
  const matches = item.matchPaths || [item.path];
  return matches.some(p => pathname === p || pathname.startsWith(`${p}/`));
};

export const findActiveNavItem = (pathname) =>
  ALL_NAV_ITEMS.find(item => isNavItemActive(pathname, item)) || null;

// Page headings for the topbar. Ordered: the first match wins, so the dynamic
// `/projects/:id` entry sits after the static `/projects` one.
export const ADMIN_ROUTE_META = [
  { path: '/dashboard', title: 'Dashboard', description: 'Your work at a glance' },
  { path: '/admin/projects', title: 'Projects', description: 'Plan and track delivery' },
  { path: '/projects', title: 'Project', description: 'Tasks, milestones and time' },
  { path: '/timelogs', title: 'Time Logs', description: 'Where the hours went' },
  { path: '/inquiries', title: 'Inquiries', description: 'New business pipeline' },
  { path: '/clients', title: 'Clients', description: 'Relationships and revenue' },
  { path: '/invoices', title: 'Invoices', description: 'Billing and payments' },
  { path: '/analytics', title: 'Analytics', description: 'Performance over time' },
  { path: '/settings', title: 'Settings', description: 'Profile, preferences and system' }
];

export const getRouteMeta = (pathname) =>
  ADMIN_ROUTE_META.find(meta =>
    pathname === meta.path || pathname.startsWith(`${meta.path}/`)
  ) || { title: 'Dashboard', description: '' };
