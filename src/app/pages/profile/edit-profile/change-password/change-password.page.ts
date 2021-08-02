import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';
import {updatePasswordStatus} from 'src/app/enums/enums';
import { FullMember } from 'src/app/models/fullmember.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  screenMode = updatePasswordStatus.UPDATE_PASSWORD;
    updatePasswordForm!: FormGroup;
    member: Member = null;
    profile: FullMember = null;

    otpForm!: FormGroup;
    requestOTPResponse!: any;

  constructor(private fb:FormBuilder, private api:AuthenticationService, private helpers:HelpersService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeForms();
    this.getMemberProfile();
  }

  get updatePasswordFormControl() {
    return this.updatePasswordForm.controls;
  }

  get otpFormControl() {
    return this.otpForm.controls;
  }

  getMemberProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      console.log(this.profile);
    }, err => {
    });
  }

  initializeForms = () => {
    // Screen Mode 1
    this.updatePasswordForm = this.fb.group({
        // UserName: ['', [Validators.required, Validators.minLength(6)]],
        Password: ['', [Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w+\\s+]).{8,}$')]],
        ConfirmPassword: ['', [Validators.required]],
    }, {
      validator: this.helpers.MatchPassword('Password', 'ConfirmPassword')
    });
    // Screen Mode 2
    this.otpForm = this.fb.group({
        OTPPin: ['', [Validators.required, Validators.minLength(5)]],
    });
};


requestUpdatePassword() {
  // if(!this.profile) {
  //   return;
  // }
  console.log(this.updatePasswordForm.value);
    const payload: any = {
        MemberIDNumber: this.profile.MemberIDNo,
        UserName: this.member.UserName
    };
    console.log(payload);


    this.api.genericRequestOTP(payload)
        .subscribe(res => {
            this.requestOTPResponse = JSON.parse(res.data);
            this.screenMode = updatePasswordStatus.VERIFICATION;
            console.log(res);
        }, err => {
            console.log(err);
            console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
        });
  };

  validateOTP = () => {
      console.log(this.otpForm.value);
      this.requestOTPResponse.OTPPin = this.otpForm.value.OTPPin;
      console.log(this.requestOTPResponse);
      this.api.submitOTP(this.requestOTPResponse)
          .subscribe(res => {
              console.log(res);
              if (JSON.parse(res.data) === 'valid') {
                  // this.screenMode = UpdatePasswordStatus.GETUSERNAME;
                  this.updatePassword();
              } else {
                  this.helpers.presentToast('OTP is invalid');
              }
          }, error => {
              console.log(error);
              this.helpers.presentToast('There was a network error, please try again');
          });
  };


  updatePassword = () => {

      console.log('updatePassword fired!');

      const payload: any = {
          MemberGuid: this.member.MemberGuid,
          UserName: this.member.UserName,
          Password: this.updatePasswordForm.value.Password,
      };


      this.api.updatePassword(payload)
          .subscribe((res: any) => {
              console.log(res);

              this.helpers.presentToast('Your password has been successfully updated. You will now be logged out and you will have to log in again.');

              this.api.logMemberOut().then(res => {
                console.log(res);
              }).catch(err => {
                console.log(err);
              })

          }, (error: any) => {
              console.log(error);
          });

  };



}
