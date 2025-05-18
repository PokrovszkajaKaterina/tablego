export interface Reservation {
  _id: string;
  restaurantId: string;
  userId: string;
  date: Date;
  time: {
    hour: number;
    minute: number;
  };
  numberOfPeople: number;
  comment: string;
  status: string;
}
