import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member, MemberDropdownOptions } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
})
export class PersonalInformationPage implements OnInit {
  member:Member = null;
  profile: FullMember = null;
  MemberImage = null;
  personalInformationForm: FormGroup;

  memberDropdownOptions!: MemberDropdownOptions;
  provincesArray!: MemberDropdownOptions['Provinces'];
  TitleArray!: MemberDropdownOptions['TitleOptions'];
  maritalStatusArray!: MemberDropdownOptions['MaritalStatusOptions'];
  genderArray!: MemberDropdownOptions['GenderOptions'];

  constructor(private api: AuthenticationService, private fb: FormBuilder, private helper: HelpersService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getMemberProfile();
    this.getOptionsFromCRM();
    this.initializePersonalInfo();
  }

  getMemberProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      // console.log(this.profile);
    }, err => {
      // console.log(err);
    });
  }

  initializePersonalInfo = () => {
    this.personalInformationForm = this.fb.group({
      isChangePlanAvailable: [true, [Validators.required]],
      optionChangeEvoOnly: [false, [Validators.required]],
      ProgramName: null,
      MemberStateCode: [''],
      BeneficiaryID: ['', [Validators.required]],
      MemberIDNo: ['', [Validators.minLength(13), Validators.maxLength(13)]],
      Gender: '',
      DOB: '',
      Employer: null,
      Dependants: [],
      EmailAddress: ['', [Validators.email]],
      FirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      LastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      MemberTitle: this.fb.control({
        ID: '',
        Description: '',
        $$hashKey: '',
      }),
      MemberMaritalStatus:
        this.fb.group({
          ID: '',
          Description: '',
          $$hashKey: '',
        }),

    });
  };

  updateMemberPersonalInfo = (form: any) => {
    // this.personalInformationForm.value.BeneficiaryID = this.memberGUID;

    const payload = this.personalInformationForm.value;
    // this.api.updateMemberPersonalInfo(payload)
    //   .subscribe(
    //     res => {
    //       this.helper.presentToast('Profile updated successfully. Thank you, a service request has been created to update your delivery address. To avoid duplication of work please do not submit these details more than once. Your updated details will be available within 48 hours.');

    //     }, err => {
    //       console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
    //       this.helper.presentToast('Please review all highlighted fields.');
    //     }
    //   );
  };

  public personalInformationFormErrorHandling = (control: string, error: string) => {
    if(this.personalInformationForm.dirty && this.personalInformationForm.touched) {
      return this.personalInformationForm.controls[control].hasError(error);
    }
  };

  getOptionsFromCRM() {
    // Fetch Dropdown items from CRM
    this.api.getBeneficiaryOptions().subscribe(res => {
      this.memberDropdownOptions = JSON.parse(res.data);
      this.provincesArray = this.memberDropdownOptions.Provinces;
      this.TitleArray = this.memberDropdownOptions.TitleOptions;
      this.maritalStatusArray = this.memberDropdownOptions.MaritalStatusOptions;
      this.genderArray = this.memberDropdownOptions.GenderOptions;
      console.log(this.memberDropdownOptions);
    });
  }

  // Used for to check set the current value on ION-SELECT
  public objectComparisonFunction(title: any, value: any): boolean {
    // console.log(title.ID)
    return title.ID === value.ID;
  }

    

}
