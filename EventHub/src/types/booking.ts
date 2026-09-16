export type Booking = {
  id: number;
  userId: number;
  eventId: number;
  bookingDate: string;
  numberOfSeats: number;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

  eventName: string;
  image: string | null;
  date: string;
  time: string;
  location: string;
  category: string;
};