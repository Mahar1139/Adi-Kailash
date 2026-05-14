export interface TourPackage {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  includes?: string[];
  itinerary?: { day: number; title: string; activities: string }[];
  image: string;
  category: string;
  baseCamp?: string;
  altitude?: string;
  grade?: string;
  stay?: string;
  distance?: string;
  eligibilityAge?: string;
  fitness?: string;
  healthAwareness?: string;
  meals?: string;
}

export interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  message: string;
  destination?: string;
  createdAt: any;
}

export interface AppUser {
  uid: string;
  email: string;
  role: 'admin';
}
