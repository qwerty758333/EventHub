const API_URL = 'http://172.19.35.177:5000/api';

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