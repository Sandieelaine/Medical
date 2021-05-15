import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { RegistrationStatus } from 'src/app/enums/enums';
import { RegisterMemberResponse } from 'src/app/models/auth.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  refferalOptions:any;
  registrationForm: FormGroup;
  otpForm: FormGroup;
  screenMode = RegistrationStatus.REG_SCREEN;
  registrationResponse!: RegisterMemberResponse;
  loadingIndicator;

  constructor(private router:Router, private api: AuthenticationService, private fb: FormBuilder, private helper: HelpersService) {
    this.otpForm = this.fb.group({
      OTPPin: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.registrationForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(3)]],
      // email: ['', Validators.required],
      CellphoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      Password: ['', Validators.required],
      GEMSMemberNumber: ['', Validators.required],
      MemberIDNumber: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      Referrals: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getRefferalOptions();
  }

  getRefferalOptions() {
    this.api.getRefferalOptions()
    .subscribe(res => {
      console.log(res);
      this.refferalOptions = JSON.parse(res.data);
      console.log(this.refferalOptions);
    }, error => {
      console.log(error);
    })
  }

  register() {
    const help = this.helper.showLoader();
    console.log(this.registrationForm.value);
    this.registrationForm.value.Referrals.$$hashKey = "object:143";
    // TODO
    this.registrationForm.value.Referral = this.registrationForm.value.Referrals;
    this.api.register(this.registrationForm.value)
    .pipe(
      delay(5000)
    )
    .subscribe(res => {
      console.log(res);
      this.registrationResponse = JSON.parse(res.data);
      this.screenMode = RegistrationStatus.VERIFICATION;
      if(this.loadingIndicator) {
        this.loadingIndicator.dismiss();
      }
    }, error => {
      console.log(error);
      if (error.status === 404) {
        console.log('Error 404');
      } else {
        this.helper.presentToast(error.error, 5000);
        if (this.loadingIndicator) {
          this.loadingIndicator.dismiss();
        }
      }
      
    })
  }

  submitOTP() {
    console.log(this.otpForm.value);
    this.registrationResponse.OTPPin = this.otpForm.value.OTPPin;
    console.log(this.registrationResponse);
    this.api.submitOTP(this.registrationResponse)
    .subscribe(res => {
      console.log(res);
      if(res == 'valid'){
        // this.helpers.openSnackBar('Your account has been successfully registered', "Close");
        this.router.navigateByUrl('/');
      }
      else {
        // this.helpers.openSnackBar('OTP is invalid', "Close");
      }
    }, error => {
      console.log(error);
      // this.helpers.openSnackBar('There was a network error, please try again', "Close");
    })
  }

  public errorHandling = (control: string, error: string) => {
    return this.registrationForm.controls[control].hasError(error);
  }

  public otpErrorHandling = (control: string, error: string) => {
    return this.otpForm.controls[control].hasError(error);
  }

  async showLoader() {
    this.loadingIndicator = await this.helper.showLoader();
  }

}
