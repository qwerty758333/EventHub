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

export async function getMyBookings(token: string) {
  const response = await fetch(`${API_URL}/bookings/my`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to fetch bookings'
    );
  }

  return data;
}

export async function getMyEvents(token: string) {
  const response = await fetch(`${API_URL}/events/mine`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to fetch your events'
    );
  }

  return data;
}

export async function getEventBookings(
  token: string,
  eventId: number
) {
  const response = await fetch(
    `${API_URL}/events/${eventId}/bookings`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to fetch event bookings'
    );
  }

  return data;
}

export async function cancelBooking(
  token: string,
  bookingId: number
) {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/cancel`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to cancel booking'
    );
  }

  return data;
}

export async function getProfile(token: string) {
  const response = await fetch(
    `${API_URL}/profile`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to fetch profile'
    );
  }

  return data;
}

export async function updateProfile(
  token: string,
  name: string,
  phone: string
) {
  const response = await fetch(
    `${API_URL}/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        phone,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to update profile'
    );
  }

  return data;
}

export async function createEvent(
  token: string,
  eventData: {
    name: string;
    description: string;
    image: string;
    date: string;
    time: string;
    location: string;
    category: string;
    price: number;
    totalSeats: number;
  }
) {
  const response = await fetch(
    `${API_URL}/events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to create event'
    );
  }

  return data;
}

export async function updateEvent(
token: string,
eventId: number,
eventData: {
name: string;
description: string;
image: string;
date: string;
time: string;
location: string;
category: string;
price: number;
totalSeats: number;
}
) {
const response = await fetch(
`${API_URL}/events/${eventId}`,
{
method: 'PUT',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`,
},
body: JSON.stringify(eventData),
}
);

const data = await response.json();

if (!response.ok) {
throw new Error(
data.message || 'Failed to update event'
);
}

return data;
}

export async function deleteEvent(
  token: string,
  eventId: number
) {
  const response = await fetch(
    `${API_URL}/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to delete event'
    );
  }

  return data;
}
