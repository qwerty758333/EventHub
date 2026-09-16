const API_URL = 'http://localhost:5000/api';

export async function getEvents() {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
}

export async function getEvent(id: string) {
  const response = await fetch(`${API_URL}/events/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  return response.json();
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone: string
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      name,
      email,
      password,
      phone,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function createBooking(
  token: string,
  eventId: number,
  numberOfSeats: number
) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      eventId,
      numberOfSeats,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to create booking'
    );
  }

  return data;
}