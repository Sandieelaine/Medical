import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordStatus } from 'src/app/enums/enums';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  isLoading = false;
  screenMode = ResetPasswordStatus.RESET_PASSWORD;
  resetPasswordForm!: FormGroup;
  submitNewPasswordForm!: FormGroup;
  otpForm!: FormGroup;
  registrationResponse!: any;

  constructor(private router: Router, private api: AuthenticationService, private fb: FormBuilder, public helper: HelpersService) { }

  ngOnInit() {
    this.initializeForms();
  }

  initializeForms = () => {

    /*
     Screen Mode 0
     */
    this.resetPasswordForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(5)]],
      GEMSMemberNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(13)]],
    });

    /*
     Screen Mode 1
     */
    this.submitNewPasswordForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(5)]],
      Password: ['', [Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w+\\s+]).{8,}$')]],
      ConfirmPassword: ['', [Validators.required]],
    }, {
      validator: this.helper.confirmedValidator('Password', 'ConfirmPassword')
    });

    /*
     Screen Mode 2
     */
    this.otpForm = this.fb.group({
      OTPPin: ['', [Validators.required, Validators.minLength(5)]],
    });

  };

  postForm (form: any) {
    console.log()
    this.isLoading = true;

    const payload: any = {
      UserName: form.UserName,
      GEMSMemberNumber: form.GEMSMemberNumber
    };

    this.api.CheckUsernameExists(payload)
      .subscribe(
        res => {
          this.isLoading = false;
          if (res) {
            

            this.api.genericRequestOTP(payload)
              .subscribe(res => {
                console.log(res);
                this.registrationResponse = JSON.parse(res.data);
                this.screenMode = ResetPasswordStatus.VERIFICATION;
              }, error => {
                console.log(error);
              });

            // this.helpers.openSnackBar('Your password has been successfully reset.', 'Close');
          }

        }, err => {
          this.screenMode = ResetPasswordStatus.RESET_PASSWORD;
          this.isLoading = false;

          // Fixed. Update Kevin
          console.log(JSON.parse(err.error).Message);
          this.helper.presentToast(JSON.parse(err.error).Message);
        }
      );
  };

  submitOTP = () => {
    // console.log(this.otpForm.value);
    // this.registrationResponse.OTPPin = this.otpForm.value.OTPPin;
    // console.log(this.registrationResponse);

    this.isLoading = true;

    this.api.submitOTP(this.registrationResponse)
      .subscribe(res => {
        console.log(res);
        if (res.data == 'valid') {
          this.isLoading = false;
          this.screenMode = ResetPasswordStatus.SUBMITNEWPASSWORD;

        } else {
          this.isLoading = false;
          this.helper.presentToast('OTP is invalid');
        }
      }, error => {
        this.isLoading = false;
        console.log(error);
        this.helper.presentToast('There was a network error, please try again');
      });
  };

  submitNewPassword = () => {
    this.isLoading = true;
    this.submitNewPasswordForm.value.UserName = this.resetPasswordForm.value.UserName;
    this.api.changePassword(this.submitNewPasswordForm.value)
      .subscribe(res => {
        this.isLoading = false;
        console.log(res);
        //   this.registrationResponse = res;
        this.helper.presentToast('Your password has been changed for username');
        // alertService.add("success","Your password has been changed for username:" + vm.User.UserName);
        this.router.navigateByUrl('/');
      }, error => {
        this.isLoading = false;
        console.log(error);
        this.helper.presentToast(error.error.Message);
        this.screenMode = ResetPasswordStatus.RESET_PASSWORD;
      });
  };

  onSubmithandler(): void {
    this.postForm(this.resetPasswordForm.value);
  }

  public errorHandling = (control: string, error: string) => {
    if (this.resetPasswordForm.controls[control].dirty) {
      return this.resetPasswordForm.controls[control].hasError(error);
    }   
  };

  public otpErrorHandling = (control: string, error: string) => {
    if (this.otpForm.controls[control].dirty) {
      return this.otpForm.controls[control].hasError(error);
    }
  };

  public submitNewPasswordErrorHandling = (control: string, error: string) => {
    if (this.submitNewPasswordForm.controls[control].dirty) {
      return this.submitNewPasswordForm.controls[control].hasError(error);
    } 
  };

}
