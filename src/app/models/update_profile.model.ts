export interface MemberEmergencyContactInfo {
    ContactID ? : string
    Name: string
    Surname: string
    TelNumber: string
    WorkNumber: string
    CellNumber: string
    EmailAddress: string
    Relationship: Relationship
    Doctor: Doctor
  }
  
  interface Relationship {
    ID: string
    Description: string
    $$hashKey: string
  }
  
  interface Doctor {
    Name: string
    Surname: string
    PracticeNumber: string
    EmegerncyContactAddress: EmegerncyContactAddress
    IsHealthPractitioner: any
    ContactNumber: any
    Address: any
    Practicenumber: string
  }
  
  interface EmegerncyContactAddress {
    AddressLine1: string
    AddressLine2: string
    AddressLine3: string
    PostalCode: string
    Province: Province
    AddressID: number
    AddressLine4: any
  }
  
  interface Province {
    ID: string
    Description: string
    $$hashKey: string
  }


