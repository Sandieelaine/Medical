export interface RegisterMember {
    GEMSMemberNumber: string;
    UserName: string;
    CellphoneNumber: string;
    MemberIDNumber: string;
    Password: string;
    ConfirmPassword: string;
    Referrals: Referrals;
    Referral: Referrals;
  }
  
  export interface Referrals {
    ID: string;
    Description: string;
    '$$hashKey': string;
  }
  
  export interface RegisterMemberResponse {
    OTPTime: string;
    Hash: string;
    OTPPin: string;
    Cellnumber: string;
    MaskedNum?: any;
  }
  