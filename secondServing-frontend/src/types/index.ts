export interface ShelterData {
    name: string;
    location: string;
    type: string; // shelter, food bank, etc.
    email:string
    password: string;
    contactInfo: string;
    role: string;
    
  }
  
  export interface DonatorData {
    name: string;
    location: string;
    type: string; // restaurant, shop, etc.
    contactInfo: string;
    password: string;
    email: string;
    role:string
    
  }
  
  export type UserType = 'shelter' | 'donator';