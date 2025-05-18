export interface OpeningHour {
  open: string;
  close: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  about: string;
  maxCapacity: number;
  openingHours: { [key: string]: OpeningHour[] }
}
