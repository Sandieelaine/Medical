export interface Member {
    '.expires': string;
    '.issued': string;
    CellphoneNumber: string;
    MemberApplicationGuid: string;
    MemberGuid: string;
    MemberIDNumber: string;
    MemberPortalCRMGuid: string;
    MemberStateCode: string;
    Platform: string;
    UserName: string;
    access_token: string;
    expires_in: number;
    token_type: string;
}

export interface MemberDropdownOptions {
    TitleOptions: TitleOption[]
    GenderOptions: GenderOption[]
    MaritalStatusOptions: MaritalStatusOption[]
    MemberRelationships: MemberRelationship[]
    Provinces: Province[]
    EthnicGroupOptions: EthnicGroupOption[]
    ReferralOptions: ReferralOption[]
  }
  
  interface TitleOption {
    ID: string
    Description: string
  }
  
  interface GenderOption {
    Description: string
    ID: string
  }
  
  interface MaritalStatusOption {
    ID: string
    Description: string
  }
  
  interface MemberRelationship {
    ID: string
    Description: string
  }
  
  interface Province {
    ID: string
    Description: string
  }
  
  interface EthnicGroupOption {
    ID: string
    Description: string
  }
  
  interface ReferralOption {
    ID: string
    Description: string
  }