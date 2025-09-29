import {
    Box,
    Bookmark,
    Calendar1,
    Element4,
    Money2,
    User,
    Profile2User,
    Trade,
    Clipboard,
    DiscountShape,
    ElementPlus,
    NotificationBing,
    Gallery,
    Send2,
    Star1,
} from "iconsax-reactjs";

export const SidebarSuperAdminApi = [
    {
        title: 'Dashboard',
        icon: <Element4 size="24" variant="TwoTone" />,
        link: '/',
    },
    {
        title: 'Bookings',
        icon: <Bookmark size="24" variant="TwoTone" />,
        link: '/admin-calender',
        subMenu: [
            {
                title: 'Calender',
                icon: <Calendar1 size="21" variant="TwoTone" />,
                link: '/admin-calender',
            },
            {
                title: 'Product Booking',
                icon: <Box size="21" variant="TwoTone" />,
                link: '/product-bookings',
            },
            {
                title: 'Service Booking',
                icon: <Clipboard size="21" variant="TwoTone" />,
                link: '/service-bookings',
            },
        ],
    },
    {
        title: 'Products',
        icon: <Box size="24" variant="TwoTone" />,
        link: '/product-categories',
        subMenu: [
            {
                title: 'Categories',
                icon: <Trade size="21" variant="TwoTone" />,
                link: '/product-categories',
            },
            {
                title: 'All Products',
                icon: <Profile2User size="21" variant="TwoTone" />,
                link: '/all-products',
            },
        ],
    },
    {
        title: 'Services',
        icon: <Clipboard size="24" variant="TwoTone" />,
        link: '/all-services',
        subMenu: [
            {
                title: 'All Services',
                icon: <Clipboard size="21" variant="TwoTone" />,
                link: '/all-services',
            },
            {
                title: 'Service Categories',
                icon: <Trade size="21" variant="TwoTone" />,
                link: '/service-categories',
            },
        ],
    },
    {
        title: 'Management',
        icon: <Profile2User size="24" variant="TwoTone" />,
        link: '/all-employees',
        subMenu: [
            {
                title: 'Employees',
                icon: <Profile2User size="21" variant="TwoTone" />,
                link: '/all-employees',
            },
            {
                title: 'Users',
                icon: <User size="21" variant="TwoTone" />,
                link: '/all-users',
            },
        ],
    },
    {
        title: 'Transactions',
        icon: <Money2 size="24" variant="TwoTone" />,
        link: '/user-transaction',
    },
    {
        title: 'Master',
        icon: <ElementPlus size="24" />,
        link: '/banner',
        subMenu: [
            {
                title: 'Banners',
                icon: <Gallery size="21" variant="TwoTone" />,
                link: '/banner',
            },
            {
                title: 'Refer & Earn',
                icon: <Send2 size="21" variant="TwoTone" />,
                link: '/referEarn',
            },
            {
                title: 'Offers & Coupons',
                icon: <DiscountShape size="21" variant="TwoTone" />,
                link: '/offersCoupons',
            },
            {
                title: 'Testimonials',
                icon: <Star1 size="21" variant="TwoTone" />,
                link: '/testimonials',
            },
            {
                title: 'Notification',
                icon: <NotificationBing size="21" variant="TwoTone" />,
                link: '/notifications',
            }
        ]
    },
];

// Employee - Limited access focused on bookings and basic operations
export const SidebarEmployeeApi = [
    {
        title: 'Dashboard',
        icon: <Element4 size="24" variant="TwoTone" />,
        link: '/',
    },
    {
        title: 'Bookings',
        icon: <Bookmark size="24" variant="TwoTone" />,
        link: '/admin-calender',
        subMenu: [
            {
                title: 'Calender',
                icon: <Calendar1 size="21" variant="TwoTone" />,
                link: '/admin-calender',
            },
            {
                title: 'Product Booking',
                icon: <Box size="21" variant="TwoTone" />,
                link: '/product-bookings',
            },
            {
                title: 'Service Booking',
                icon: <Clipboard size="21" variant="TwoTone" />,
                link: '/service-bookings',
            },
        ],
    },
    {
        title: 'Products',
        icon: <Box size="24" variant="TwoTone" />,
        link: '/product-categories',
        subMenu: [
            {
                title: 'Categories',
                icon: <Trade size="21" variant="TwoTone" />,
                link: '/product-categories',
            },
            {
                title: 'All Products',
                icon: <Profile2User size="21" variant="TwoTone" />,
                link: '/all-products',
            },
        ],
    },
    {
        title: 'Services',
        icon: <Clipboard size="24" variant="TwoTone" />,
        link: '/all-services',
        subMenu: [
            {
                title: 'All Services',
                icon: <Clipboard size="21" variant="TwoTone" />,
                link: '/all-services',
            },
            {
                title: 'Service Categories',
                icon: <Trade size="21" variant="TwoTone" />,
                link: '/service-categories',
            },
        ],
    },
    {
        title: 'Management',
        icon: <Profile2User size="24" variant="TwoTone" />,
        link: '/all-users',
        subMenu: [
            {
                title: 'Users',
                icon: <User size="21" variant="TwoTone" />,
                link: '/all-users',
            },
        ],
    },
    {
        title: 'Transactions',
        icon: <Money2 size="24" variant="TwoTone" />,
        link: '/user-transaction',
    },
    {
        title: 'Master',
        icon: <ElementPlus size="24" />,
        link: '/banner',
        subMenu: [
            {
                title: 'Banners',
                icon: <Gallery size="21" variant="TwoTone" />,
                link: '/banner',
            },
            {
                title: 'Refer & Earn',
                icon: <Send2 size="21" variant="TwoTone" />,
                link: '/referEarn',
            },
            {
                title: 'Offers & Coupons',
                icon: <DiscountShape size="21" variant="TwoTone" />,
                link: '/offersCoupons',
            },
            {
                title: 'Testimonials',
                icon: <Star1 size="21" variant="TwoTone" />,
                link: '/testimonials',
            },
            {
                title: 'Notification',
                icon: <NotificationBing size="21" variant="TwoTone" />,
                link: '/notifications',
            }
        ]
    },
];

export const SidebarAstrologerApi = [
    {
        title: 'Dashboard',
        icon: <Element4 size="24" variant="TwoTone" />,
        link: '/',
    },
    {
        title: 'Bookings',
        icon: <Bookmark size="24" variant="TwoTone" />,
        link: '/calender',
        subMenu: [
            {
                title: 'Calender',
                icon: <Calendar1 size="21" variant="TwoTone" />,
                link: '/calender',
            },
            {
                title: 'Service Booking',
                icon: <Clipboard size="21" variant="TwoTone" />,
                link: '/service-bookings',
            },
        ],
    },
];

export const SidebarAdminApi = SidebarSuperAdminApi;
