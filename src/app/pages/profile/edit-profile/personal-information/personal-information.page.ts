import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

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

  constructor(private api: AuthenticationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.member = this.api.getMember();
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
      MemberTitle: this.fb.group({
        ID: '',
        Description: '',
        $$hashKey: ''
      }),
      FirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      LastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      TelNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      WorkNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      CellNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      EmailAddress: ['', [Validators.required, Validators.email]],
      MemberMaritalStatus: this.fb.group({
        ID: '',
        Description: '',
        $$hashKey: ''
      }),
      Gender:  this.fb.group({
        ID: '',
        Description: '',
        $$hashKey: ''
      }),
      MemberIDNo: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      DOB: '',
    });
  };

}
