export interface Contact {
  CallCentreNum: string;
  EmergencyNum: string;
  FruadNum: string;
  Emails: Email[];
  OpenHrsWeek: string;
  OpenHrsSat: string;
  PostalAddress: string;
  CurrentDate: string;
  OpenHoursToday: string;
  IsOpen: boolean;
}

interface Email {
  Address: string;
  Description: string;
}
export interface suggestionsOrImprovements {
  ID: string;
  Description: string;
  SubCategories: SubCategory[];
}

export interface suggestionsOrImprovementsPayload {
  CaseTypeDescription: string;
  UserInput: string;
  Category: Category;
  SubCategory: SubCategory;
}

interface Category {
  ID: string;
  Description: string;
  SubCategories: SubCategory[];
  '$$hashKey': string;
}

interface SubCategory {
  ID: string;
  Description: string;
  CategoryId: string;
  '$$hashKey': string;
}