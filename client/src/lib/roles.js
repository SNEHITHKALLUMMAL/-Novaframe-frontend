/**
 * Mirrors the backend's role hierarchy (server's utils/roleAuthorization.js,
 * added PHASE_04): super_admin is a strict superset of admin. Kept as one
 * shared helper rather than duplicated `role === 'admin'` checks across
 * AdminRoute.jsx/Sidebar.jsx/MobileSidebarDrawer.jsx — found during
 * PHASE_15's audit that all three had drifted out of sync with the
 * backend's role model (checking 'admin' exactly, which would have
 * silently locked a super_admin out of the admin UI while every one of
 * their API calls succeeded).
 */
const ADMIN_ROLES = ['admin', 'super_admin'];

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}
