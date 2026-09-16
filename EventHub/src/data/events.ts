import { Event } from '../types/event';

export const events: Event[] = [
  {
    id: '1',
    name: 'Colombo Tech Conference',
    description:
      'A technology conference bringing together students, developers, entrepreneurs and technology enthusiasts.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    date: 'September 25, 2026',
    time: '9:00 AM',
    location: 'BMICH, Colombo',
    category: 'Technology',
    price: 2500,
    availableSeats: 120,
    totalSeats: 150,
  },
  {
    id: '2',
    name: 'Live Music Night',
    description:
      'Enjoy an evening of live music featuring talented local artists.',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    date: 'September 28, 2026',
    time: '7:00 PM',
    location: 'Viharamahadevi Park, Colombo',
    category: 'Music',
    price: 1500,
    availableSeats: 80,
    totalSeats: 100,
  },
  {
    id: '3',
    name: 'Startup Workshop',
    description:
      'Learn how to transform your idea into a practical startup.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72',
    date: 'October 2, 2026',
    time: '10:00 AM',
    location: 'Trace Expert City, Colombo',
    category: 'Business',
    price: 2000,
    availableSeats: 45,
    totalSeats: 50,
  },
  {
    id: '4',
    name: 'Colombo Marathon',
    description:
      'Join runners from across the country for an exciting city marathon.',
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
    date: 'October 10, 2026',
    time: '6:00 AM',
    location: 'Galle Face Green, Colombo',
    category: 'Sports',
    price: 1000,
    availableSeats: 300,
    totalSeats: 500,
  },
];