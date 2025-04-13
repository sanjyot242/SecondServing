export interface ShelterData {
    name: string;
    location: string;
    volunteerEmails: string[];
    password: string;
    contactNumber: string;
  }
  
  export interface DonatorData {
    name: string;
    location: string;
    type: string; // restaurant, shop, etc.
    contactInfo: string;
    password: string;
    email: string;
  }
  
  export type UserType = 'shelter' | 'donator';