// Response from Claims By Date
export interface ClaimsByDate {
  referenceNumber: string;
  Status?: any;
  dateAssessed: string;
  serviveProvider: ServiveProvider;
  feesCharged: FeesCharged;
  schemeRate?: any;
  Provider: string;
  benefitAmount: FeesCharged;
  memberPortion: FeesCharged;
  beneficiaryNumber?: any;
  isRejectedClaimBeingViewed: boolean;
  PatientName: string;
  message?: any;
  summary: Summary;
  claimItems: ClaimItem[];
  rejectmessage: string;
}

interface ClaimItem {
  beneficiaryNumber: string;
  identityNumber: string;
  schemeOption: string;
  realClaimIndicator: number;
}

interface Summary {
  lines: number;
  settled: number;
  rejected: number;
}

interface FeesCharged {
  Currency: string;
  Amount: number;
}

interface ServiveProvider {
  pcnsPracticeNumber: string;
  providerName: string;
}

// Response from all Claims History 
export interface ClaimsHistory {
    open?: any;
    isChangePlanAvailable: boolean;
    optionChangeEvoOnly: boolean;
    ProgramName?: any;
    MemberStateCode: string;
    BeneficiaryID: string;
    FullName: string;
    MemberNo: string;
    BeneficiaryCode: string;
    MemberIDNo: string;
    Gender: string;
    DOB: string;
    RemainingBenefit: number;
    UsedBenefit: number;
    AllocatedBenefit: number;
    Employer?: any;
    Dependants: Dependant[];
    EmailAddress: string;
    Plan?: any;
    FirstName: string;
    LastName: string;
    MemberTitle?: any;
    MemberMaritalStatus?: any;
    ManagedProgram?: any;
    PractitionerName?: any;
    PractitionerChangeDate: string;
    isElectionsActive: boolean;
    isPrincipleMember: boolean;
    Provinces?: any;
    underWriting?: any;
    underWritingRule?: any;
    SuggestedProviders?: any;
    ClaimHistory: ClaimHistory2[];
  }
  
  interface ClaimHistory2 {
    ClaimID: string;
    ClaimNumber: string;
    Status: string;
    Date: string;
    PracticeProvider?: string;
    Provider: string;
    PatientName: string;
    ChargedAmt: number;
    TariffAmt?: any;
    BenefitAmt: number;
    RuleName?: string;
    MemberName?: any;
    RejectionList?: RejectionList[];
  }
  
  interface Dependant {
    isChangePlanAvailable: boolean;
    optionChangeEvoOnly: boolean;
    ProgramName?: any;
    MemberStateCode?: any;
    BeneficiaryID: string;
    FullName: string;
    MemberNo: string;
    BeneficiaryCode: string;
    MemberIDNo: string;
    Gender: string;
    DOB: string;
    RemainingBenefit: number;
    UsedBenefit: number;
    AllocatedBenefit: number;
    Employer?: any;
    Dependants?: any;
    EmailAddress?: any;
    Plan?: any;
    FirstName: string;
    LastName: string;
    MemberTitle?: any;
    MemberMaritalStatus?: any;
    ManagedProgram?: any;
    PractitionerName?: any;
    PractitionerChangeDate: string;
    isElectionsActive: boolean;
    isPrincipleMember: boolean;
    Provinces?: any;
    underWriting?: any;
    underWritingRule?: any;
    SuggestedProviders?: any;
    ClaimHistory: ClaimHistory[];
  }
  
  interface ClaimHistory {
    ClaimID: string;
    ClaimNumber: string;
    Status: string;
    Date: string;
    PracticeProvider?: string;
    Provider: string;
    PatientName: string;
    ChargedAmt: number;
    TariffAmt?: any;
    BenefitAmt: number;
    RuleName?: string | string;
    MemberName?: any;
    RejectionList?: RejectionList[];
  }
  
  interface RejectionList {
    RejectionReasonDescription?: any;
  }