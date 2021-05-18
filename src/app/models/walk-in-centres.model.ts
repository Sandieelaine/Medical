export interface WalkInCentre {
    Province: Province;
    OperatingHours: OperatingHours;
    PracticeNumber?: any;
    Name?: any;
    Type: Province;
    LatitudeLongitude: string;
    Latitude?: any;
    Longitude?: any;
    TelephoneNumber?: any;
    Email?: any;
    AddressID: number;
    AddressLine1: string;
    AddressLine2: string;
    AddressLine3: string;
    AddressLine4: string;
    PostalCode?: any;
  }
  
  interface OperatingHours {
    MidWeek: string;
    Saturday: string;
  }
  
  interface Province {
    ID: string;
    Description: string;
  }