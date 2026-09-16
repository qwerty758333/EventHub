const db = require('./database');

const existingOrganizer = db
  .prepare('SELECT id FROM users WHERE email = ?')
  .get('organizer@eventhub.com');

let organizerId;

if (existingOrganizer) {
  organizerId = existingOrganizer.id;
} else {
  const result = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run(
    'EventHub Organizer',
    'organizer@eventhub.com',
    'temporary-password',
    'ORGANIZER'
  );

  organizerId = result.lastInsertRowid;
}

const existingEvents = db
  .prepare('SELECT COUNT(*) AS count FROM events')
  .get();

if (existingEvents.count > 0) {
  console.log('Events already exist. Nothing to seed.');
  process.exit(0);
}

const insertEvent = db.prepare(`
  INSERT INTO events (
    organizer_id,
    name,
    description,
    image,
    date,
    time,
    location,
    category,
    price,
    total_seats,
    available_seats
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const events = [
  {
    name: 'Colombo Tech Conference',
    description:
      'A technology conference featuring talks, demonstrations and networking opportunities.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    date: '2026-10-10',
    time: '09:00 AM',
    location: 'Colombo',
    category: 'Technology',
    price: 2500,
    seats: 120,
  },
  {
    name: 'Live Music Night',
    description:
      'Enjoy an evening of live performances from talented local musicians.',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    date: '2026-10-15',
    time: '07:00 PM',
    location: 'Colombo',
    category: 'Music',
    price: 1500,
    seats: 80,
  },
  {
    name: 'Startup Workshop',
    description:
      'Learn about startup development, business planning and entrepreneurship.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72',
    date: '2026-10-20',
    time: '10:00 AM',
    location: 'Colombo',
    category: 'Business',
    price: 2000,
    seats: 45,
  },
  {
    name: 'Colombo Marathon',
    description:
      'Take part in a city-wide sporting event for runners of different experience levels.',
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
    date: '2026-11-05',
    time: '06:00 AM',
    location: 'Colombo',
    category: 'Sports',
    price: 1000,
    seats: 300,
  },
];

for (const event of events) {
  insertEvent.run(
    organizerId,
    event.name,
    event.description,
    event.image,
    event.date,
    event.time,
    event.location,
    event.category,
    event.price,
    event.seats,
    event.seats
  );
}

console.log('Events seeded successfully.');