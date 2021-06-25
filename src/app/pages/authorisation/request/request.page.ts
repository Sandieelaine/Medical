import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  authorizationForm!: FormGroup;
  member:Member = null;
  profile:FullMember = null;
  MemberImage;

  constructor(private fb: FormBuilder, private api: AuthenticationService, private helpers: HelpersService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.loadProfile();
    this.initializeauthorizationForm();
  }

  initializeauthorizationForm = () => {
    this.authorizationForm = this.fb.group({
      AuthType: ['', Validators.required],
      HospName: ['', Validators.required],
      HospDuration: ['', Validators.required],
      AdmissionDate: ['', Validators.required],
      AdmissionReason: '',
      ProcedureDescription: [''],
      ProcedureDoctor: this.fb.group({
        Name:  [''],
        Surname:  [''],
        ContactNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
        PracticeNumber: [''],
      })
    });
  }

  loadProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token)
    .subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
    })
  }

  postAuthorizationForm = (form: any) => {
    const payload = this.authorizationForm.value;
    this.api.requestAuthorisation(payload, this.member.MemberGuid, this.member.access_token)
      .subscribe(
        res => {
            this.helpers.presentToast('Authorizations successfully sent');

        }, err => {
          console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
          this.helpers.presentToast('There was an error in sending the authorization request');
        }
      );
  };

  public errorHandling = (control: string, error: string) => {
    console.log(this.authorizationForm.controls[control]);
    if (this.authorizationForm.controls[control].touched && this.authorizationForm.controls[control].dirty) {
      return this.authorizationForm.controls[control].hasError(error);
    }
  }

  submitPreAuthRequest() {
    console.log(this.authorizationForm.value);
    return;
    this.api.requestAuthorisation(this.authorizationForm.value, this.member.MemberGuid, this.member.access_token)
  }

}
