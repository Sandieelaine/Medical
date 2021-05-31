interface EVOChangeOption {
    BeneficiaryNumber: string;
    memberNumber: string;
    proposedBenefitOption: string;
    mainMemberPractitioner: string;
    PracticeNumber: string;
    Doyouwanttoapplythispractitionertoall: boolean;
    mainMemberProvince: string;
    mainMemberCity: string;
    Dependants: Dependant[];
  }
  
  interface Dependant {
    FullName: string;
    BeneficiaryNumber: string;
    DependantsPractitioner: string;
    PracticeNumber: string;
    DependantProvince: string;
    DependantCity: string;
  }