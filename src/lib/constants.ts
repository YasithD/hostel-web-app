import { DashboardMenuItem } from "./types";

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
    {
        label: 'Overview',
        href: '/dashboard',
        icon: 'dashboard'
    },
    {
        label: 'New Booking',
        href: '/dashboard/new-booking',
        icon: 'plus'
    },
    {
        label: 'Request History',
        href: '/dashboard/request-history',
        icon: 'history'
    },
    {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: 'settings'
    }
]
