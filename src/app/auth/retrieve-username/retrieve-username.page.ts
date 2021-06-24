import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckUsernameExistsStatus } from 'src/app/enums/enums';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-retrieve-username',
  templateUrl: './retrieve-username.page.html',
  styleUrls: ['./retrieve-username.page.scss'],
})
export class RetrieveUsernamePage implements OnInit {
  isLoading = false;
  screenMode = CheckUsernameExistsStatus.CHECKUSERNAME_EXISTS;
  checkUsernameExistsForm!: FormGroup;
  getUsernameForm!: FormGroup;
  otpForm!: FormGroup;
  requestOTPResponse!: any;
  yourUserName!: string;

  constructor(private router: Router, private api: AuthenticationService, private fb: FormBuilder, public helper: HelpersService) { }

  ngOnInit() {
    this.initializeForms();
  }

  initializeForms() {
    //Screen Mode 1
    this.checkUsernameExistsForm = this.fb.group({
      GEMSMemberNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(13)]],
    });
    //Screen Mode 2
    this.otpForm = this.fb.group({
      OTPPin: ['', [Validators.required, Validators.minLength(5)]],
    });
    //Screen Mode 3
    this.getUsernameForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(5)]],
    });


  };

  checkUsernameExists = (form: any) => {
    this.isLoading = true;

    const payload: any = {
      MemberIDNumber: this.checkUsernameExistsForm.value.GEMSMemberNumber
    };

    this.api.checkUsernameExistsRetrieveUsername(payload)
      .subscribe(
        res => {
          this.isLoading = false;
          if (JSON.parse(res.data) === true) {

            this.api.genericRequestOTP(payload)
              .subscribe(res => {
                console.log(res);
                this.requestOTPResponse = JSON.parse(res.data);
                this.screenMode = CheckUsernameExistsStatus.VERIFICATION;
              }, err => {
                console.log(err);
                console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
              });
          }

        }, err => {
          this.screenMode = CheckUsernameExistsStatus.CHECKUSERNAME_EXISTS;
          this.isLoading = false;
          console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
          this.helper.presentToast(err.error.Message);
        }
      );
  };

  submitOTP = () => {
    console.log(this.otpForm.value);
    this.requestOTPResponse.OTPPin = this.otpForm.value.OTPPin;
    console.log(this.requestOTPResponse);
    this.api.submitOTP(this.requestOTPResponse)
      .subscribe(res => {
        console.log(res);
        if (JSON.parse(res.data) == 'valid') {
          //this.screenMode = CheckUsernameExistsStatus.GETUSERNAME;
          this.getUsername();
        } else {
          this.helper.presentToast('OTP is invalid');
        }
      }, error => {
        console.log(error);
        this.helper.presentToast('There was a network error, please try again');
      });
  };

  getUsername = () => {
    // this.data.getUsername(this.getUsernameForm.value)
    console.log('getUsername Clicked')
    console.log(this.checkUsernameExistsForm.value.GEMSMemberNumber)
 
    const payload: any = {
     MemberIDNumber: this.checkUsernameExistsForm.value.GEMSMemberNumber
   };

   this.api.getUsername(payload)
      .subscribe(res => {
        console.log(res);
        this.yourUserName = JSON.parse(res.data);
        this.router.navigate(['/', 'login', this.yourUserName]);
      }, error => {
        console.log(error);
        // this.helpers.openSnackBar(error.error.Message, 'Close');
        // this.screenMode = CheckUsernameExistsStatus.CHECKUSERNAME_EXISTS;
      });

  };

  public checkUsernameExistsFormErrorHandling = (control: string, error: string) => {
    return this.checkUsernameExistsForm.controls[control].hasError(error);
  };

  public otpErrorHandling = (control: string, error: string) => {
    return this.otpForm.controls[control].hasError(error);
  };

  public getUsernameErrorHandling = (control: string, error: string) => {
    return this.getUsernameForm.controls[control].hasError(error);
  };



}
