// src/utils/constants.js

export const STATS = [
    {
        id: 1,
        value: '8K+',
        label: 'Houses Available'
    },
    {
        id: 2,
        value: '6K+',
        label: 'Houses Sold'
    },
    {
        id: 3,
        value: '2K+',
        label: 'Trusted Agents'
    }
];

export const FEATURES = [
    {
        id: 1,
        title: 'Expert Guidance',
        description: 'Benefit from our experts seasoned expertise for a smooth home buying',
        icon: 'user-check'
    },
    {
        id: 2,
        title: 'Personalized Service',
        description: 'Our services cater to your unique needs, making your journey stress-free',
        icon: 'heart'
    },
    {
        id: 3,
        title: 'Transparent Process',
        description: 'Stay informed with our clear and honest approach to buying your home',
        icon: 'file-text'
    },
    {
        id: 4,
        title: 'Exceptional Support',
        description: 'Experience peace of mind with our responsive and informative assistance',
        icon: 'headphones'
    }
];

export const PROPERTIES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        location: 'San Francisco, California',
        bedrooms: 4,
        area: '5,500 sq ft',
        price: '$2,500,000'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        location: 'Beverly Hills, California',
        bedrooms: 3,
        area: '4,500 sq ft',
        price: '$850,000'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        location: 'Palo Alto, California',
        bedrooms: 6,
        area: '8,200 sq ft',
        price: '$3,700,000'
    }
];

export const TESTIMONIALS = [
    {
        id: 1,
        name: 'Sarah Nguyen',
        location: 'San Jose',
        rating: 5.0,
        avatar: 'https://i.pravatar.cc/150?img=1',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        text: 'Dwello truly cares about their clients. They listened to my needs and found me the perfect home. The entire process was smooth, and I felt supported every step of the way. Highly recommend!'
    },
    {
        id: 2,
        name: 'Michael Rodriguez',
        location: 'San Diego',
        rating: 4.5,
        avatar: 'https://i.pravatar.cc/150?img=12',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
        text: 'I had an amazing experience with Dwello. Their expertise and personalized service exceeded my expectations. I found my dream home, and the process was stress-free. Highly recommend!'
    },
    {
        id: 3,
        name: 'Emily Johnson',
        location: 'Los Angeles',
        rating: 5.0,
        avatar: 'https://i.pravatar.cc/150?img=5',
        image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400',
        text: "Dwello made my home search a reality! Their team provided exceptional support and guided me throughout. I couldn't be happier with my new home!"
    }
];

export const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Service', href: '#services' },
    { label: 'Agents', href: '#agents' },
    { label: 'Contact', href: '#contact' }
];

export const FOOTER_LINKS = {
    about: [
        { label: 'Our Story', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Our Team', href: '#' },
        { label: 'Resources', href: '#' }
    ],
    support: [
        { label: 'FAQ', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Terms of Service', href: '#' }
    ],
    findUs: [
        { label: 'Events', href: '#' },
        { label: 'Locations', href: '#' },
        { label: 'Newsletter', href: '#' }
    ]
};