import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
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

  constructor(private fb: FormBuilder, private api: AuthenticationService, private helpers: HelpersService, private loadingCtrl: LoadingController) { }

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
      AdmissionReason: ['', Validators.required],
      ProcedureDescription: ['', Validators.required],
      ProcedureDoctor: this.fb.group({
        Name:  ['', Validators.required],
        Surname:  ['', Validators.required],
        ContactNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
        PracticeNumber: ['', Validators.required],
      })
    });
  }

  get authorizationFormControl() {
    return this.authorizationForm.controls;
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
    if (this.authorizationForm.touched && this.authorizationForm.dirty) {
      return this.authorizationForm.controls[control].hasError(error);
    }
  }

  submitPreAuthRequest() {
    console.log(this.authorizationForm.value);
    this.showLoader();
    this.api.requestAuthorisation(this.authorizationForm.value, this.member.MemberGuid, this.member.access_token)
    .subscribe(res => {
      this.checkAndCloseLoader();
      if(JSON.parse(res.data) === true) {
        console.log(true);
        this.helpers.presentToast('Authorisation submitted successfully.');
      }
      console.log(res);
    }, err => {
      this.checkAndCloseLoader();
      this.helpers.presentToast('Authorisation submission failed.');
      console.log(err)
    })
  }

  async checkAndCloseLoader() {
    // Use getTop function to find the loader and dismiss only if loader is present.
    const loader = await this.loadingCtrl.getTop();
    // if loader present then dismiss
     if(loader !== undefined) { 
       await this.loadingCtrl.dismiss();
     }
   }

   async showLoader() {
    let loaderFunc = await this.loadingCtrl.create({
      spinner: 'circular',
      message: 'Loading',
      cssClass: 'login-spinner'
    });
    await loaderFunc.present();
  }

}
