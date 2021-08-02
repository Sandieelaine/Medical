import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CheckUsernameExistsStatus } from 'src/app/enums/enums';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.page.html',
  styleUrls: ['./change-username.page.scss'],
})
export class ChangeUsernamePage implements OnInit {
  checkUsernameExistsForm:FormGroup;
  otpForm:FormGroup;
  getUsernameForm:FormGroup;
  member:Member;
  profile:FullMember;
  yourUserName: string;

  screenMode = CheckUsernameExistsStatus.CHECKUSERNAME_EXISTS;
  requestOTPResponse: any;

  constructor(private fb:FormBuilder, private api:AuthenticationService, private helpers:HelpersService, private loadingCtrl: LoadingController, private router:Router) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeForm();
    this.getMemberProfile();
  }

  getMemberProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      console.log(this.profile);
    }, err => {
      console.log(err);
    });
  }


  initializeForm() {
    // Screen Mode 1
    this.checkUsernameExistsForm = this.fb.group({
        UserName: ['', [Validators.required, Validators.minLength(6)]],
    });
    // Screen Mode 2
    this.otpForm = this.fb.group({
        OTPPin: ['', [Validators.required, Validators.minLength(5)]],
    });
    // Screen Mode 3
    this.getUsernameForm = this.fb.group({
        UserName: ['', [Validators.required, Validators.minLength(5)]],
    });
  };

  checkUsernameExists() {

    const payload1: any = {
        MemberIDNumber: this.profile.MemberIDNo,
        UserName: this.checkUsernameExistsForm.value.UserName
    };

    const payload2: any = {
        MemberIDNumber: this.profile.MemberIDNo,
        UserName: this.member.UserName
    };

    this.api.checkUsernameExistsChangeUsername(payload1)
        .subscribe(
            res => {
                if (JSON.parse(res.data) === true) {
                    this.screenMode = CheckUsernameExistsStatus.CHECKUSERNAME_EXISTS;
                    this.helpers.presentToast('Username already exists');
                } else {
                    this.helpers.presentToast('This username already exists, please choose another.');
                }
            }, err => {
                this.api.genericRequestOTP(payload2)
                    .subscribe(res => {
                        console.log(res);
                        this.requestOTPResponse = JSON.parse(res.data);
                        console.log(this.requestOTPResponse);
                        this.screenMode = CheckUsernameExistsStatus.VERIFICATION;
                        // tslint:disable-next-line:no-shadowed-variable
                    }, err => {
                        console.log(err);
                        console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
                    });

                // console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
                // this.helpers.openSnackBar(err.error.Message, 'Close');
            }
        );
};

submitOTP() {
  console.log(this.otpForm.value);
  this.requestOTPResponse.OTPPin = this.otpForm.value.OTPPin;
  console.log(this.requestOTPResponse, '103');
  this.api.submitOTP(this.requestOTPResponse)
    .subscribe(res => {
      // console.log(res, '106');
      if (JSON.parse(res.data) == 'valid') {
        console.log(JSON.parse(res.data), '108')
        //this.screenMode = CheckUsernameExistsStatus.GETUSERNAME;
        this.changeUsername();
      } else {
        this.helpers.presentToast('OTP is invalid');
      }
    }, error => {
      console.log(error);
      this.helpers.presentToast('There was a network error, please try again');
    });
};

// getUsername() {
//   // this.data.getUsername(this.getUsernameForm.value)
//   console.log('getUsername Clicked')
//   console.log(this.checkUsernameExistsForm.value.GEMSMemberNumber, '123')

//   const payload: any = {
//    MemberIDNumber: this.checkUsernameExistsForm.value.GEMSMemberNumber
//  };

//  this.api.getUsername(payload)
//     .subscribe(res => {
//       console.log(res);
//       this.yourUserName = JSON.parse(res.data);
//       this.router.navigate(['/', 'login', this.yourUserName]);
//     }, error => {
//       console.log(error);
//       // this.helpers.openSnackBar(error.error.Message, 'Close');
//       // this.screenMode = CheckUsernameExistsStatus.CHECKUSERNAME_EXISTS;
//     });

// };

changeUsername = () => {

  console.log('changeUsername fired!');

  const payload: any = {
      MemberGuid: this.member.MemberGuid,
      MemberIDNumber: this.profile.MemberIDNo,
      UserName: this.checkUsernameExistsForm.value.UserName
  };


  this.api.ChangeUsername(payload)
      .subscribe((res: any) => {
          console.log(res);
          this.yourUserName = res;
          this.helpers.presentToast('Your username has been successfully updated. You will now be logged out and you will have to log in again.');

          this.api.logMemberOut()

      }, (error: any) => {
          console.log(error);
          // this.helpers.openSnackBar(error.error.Message, 'Close');
          // this.screenMode = CheckUsernameExistsStatus.CHECKUSERNAME_EXISTS;
      });

};

  public otpErrorHandling = (control: string, error: string) => {
    if(this.otpForm.touched) {
      return this.otpForm.controls[control].hasError(error);
    }
  };


}
