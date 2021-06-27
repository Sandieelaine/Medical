import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { MemberEmergencyContactInfo } from 'src/app/models/update_profile.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-emergency-information',
  templateUrl: './emergency-information.page.html',
  styleUrls: ['./emergency-information.page.scss'],
})
export class EmergencyInformationPage implements OnInit {
  memberemergencyContactInfo!: MemberEmergencyContactInfo;
  emergencyContactInfoForm!: FormGroup;
  member:Member;
  GUID;

  constructor(private fb: FormBuilder, private api: AuthenticationService, private helpers: HelpersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.activatedRoute.paramMap
    .subscribe(paramMap => {
      this.GUID = paramMap.get('guid');
      console.log(this.GUID)
    });
    this.getMemberEmergencyContactInfo();
    this.initializeMemberEmergencyContactInfo();
  }


  initializeMemberEmergencyContactInfo() {
    this.emergencyContactInfoForm = this.fb.group({
      ContactID: '',
      Name: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      Surname: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      TelNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      WorkNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      CellNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      EmailAddress: ['', [Validators.required, Validators.email]],
      Relationship: this.fb.group({
        ID: '',
        Description: '',
        $$hashKey: '',
      }),
      Doctor: this.fb.group({
        Name: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
        Surname: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
        PracticeNumber: '',
        EmegerncyContactAddress: this.fb.group({
          AddressLine1: '',
          AddressLine2: '',
          AddressLine3: '',
          PostalCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
          Province: '',
        }),
      }),
    });
  };

  getMemberEmergencyContactInfo() {
    // this.helpers.presentLoadingIndicator();
    this.api.getMemberEmergencyContactInfo(this.GUID, this.member.access_token)
      .subscribe(res => {
        // this.helpers.hideLoadingIndicator();
        this.memberemergencyContactInfo = JSON.parse(res.data);
        console.log(JSON.parse(res.data));
      }, err => {
        // this.helpers.hideLoadingIndicator();
        console.log(err);
      });
  };

  updateEmergencyContactInfo = (form: any) => {
    const payload = this.emergencyContactInfoForm.value;
    this.helpers.presentLoadingIndicator();
    this.api.updateMemberEmergencyContactInfo(payload, this.GUID, this.member.access_token)
      .subscribe(
        res => {
          this.helpers.hideLoadingIndicator();
          this.helpers.presentToast('Emergency Contact Information updated successfully');
        }, err => {
          this.helpers.hideLoadingIndicator();
          console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
          this.helpers.presentToast('Please review all highlighted fields.');
        }
      );
  };


  public errorHandling = (control: string, error: string) => {
    // console.log(this.contactInfo_controllers)
    // if(this.contactInfo_controllers.controls) {

    // console.log(this.contactInfo_controllers)
    // console.log(this.MemberContactInfoForm.controls)
    // return this.MemberContactInfoForm.controls[control].hasError(error);
  };



}
