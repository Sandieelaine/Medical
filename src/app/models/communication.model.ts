export interface MemberCommunicationPreferences {
    CommPreferenceID?: string
    AnnualOptionChange?: string
    ClaimInformation?: string
    Newsletter?: string
    PersonalisedLetter?: string
    Statements?: string
    Language?: Language
    StatementEmail?: any
    StatementSMS?: any
    StatementPost?: any
    ClaimInfoEmail?: any
    ClaimInfoSMS?: any
    ClaimInfoPost?: any
    AnnualInfoEmail?: any
    AnnualInfoSMS?: any
    AnnualInfoPost?: any
    PersonLettersEmail?: any
    PersonLettersSMS?: any
    PersonLettersPost?: any
    NewsEmail?: any
    NewsSMS?: any
    NewsPost?: any
    PersonalisedLetterEmail?: any
    PersonalisedLetterSMS?: any
    PersonalisedLetterPost?: any
    AnnualOptionChangeEmail?: any
    AnnualOptionChangeSMS?: any
    AnnualOptionChangeLetterPost?: any
  }
  
  export interface Language {
    ID?: string
    Description?: string
  }
  

  export interface StandardCommunicationPreferences {
    Languages?: Language[]
  }
  
  export interface Language {
    ID?: string
    Description?: string
  }