interface BenefitUsage {
    Description: string;
    Code: string;
    PercentageCovered: number;
    IsUnlimited: boolean;
    MaxAmount: MaxAmount;
    UsedAmount: MaxAmount;
    FreeAmount: MaxAmount;
    BenefitUsageBeneficiaries?: BenefitUsageBeneficiary[];
    MaxUnits?: any;
    UsedUnits?: any;
    FreeUnits?: any;
    IsChronicMedication: boolean;
    IsSelfMedication: boolean;
    IsAcuteMedication: boolean;
    IsMajor: boolean;
    ShowBeneficiaryLevel: boolean;
    DisplayType: number;
    open?: any;
  }
  
  interface BenefitUsageBeneficiary {
    BeneficiaryNumber: string;
    MaxAmount: MaxAmount;
    UsedAmount: MaxAmount;
    FreeAmount: MaxAmount;
    MaxUnits?: number;
    UsedUnits?: number;
    IsUnlimited: boolean;
    DisplayType: number;
  }
  
  interface MaxAmount {
    Currency: string;
    Amount: number;
  }