export interface FullMember {
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
  Plan: Plan;
  FirstName: string;
  LastName: string;
  MemberTitle: MemberTitle;
  MemberMaritalStatus: MemberTitle;
  ManagedProgram: any[];
  PractitionerName?: any;
  PractitionerChangeDate: string;
  isElectionsActive: boolean;
  isPrincipleMember: boolean;
  Provinces?: any;
  underWriting: any[];
  underWritingRule: any[];
  SuggestedProviders?: any;
  ClaimHistory?: any;
}

interface MemberTitle {
  ID: string;
  Description: string;
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
  Plan: Plan;
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
  ClaimHistory?: any;
}

interface Plan {
  BenefitID: number;
  BenefitPlanName: string;
  RegisteredDate: string;
  EffectiveFromDate: string;
  LastCardIssuedDate?: any;
  RegisteredProgrammeName?: any;
  MonthlySalary: number;
  IsNewEmployee: boolean;
  HasMedicalScheme: boolean;
}
