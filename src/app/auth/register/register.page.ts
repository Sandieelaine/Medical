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

  constructor(private router:Router, private api: AuthenticationService, private fb: FormBuilder, public helper: HelpersService) {
    this.getRefferalOptions();
  }

  ngOnInit() {
    this.initializeForms();
    
  }

  initializeForms() {
    /*
     Screen Mode 0
     */

    // Validation Rules

    // The username must be at least 6 characters and must not contain any spaces
    // The password must be a minimum of 8 characters.
    // Must contain a least a capital letter, a number and a special character (e.g #,!,@).

    this.registrationForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(6)]], // Username must not contain any spaces
      CellphoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8)]],
      Password: ['', [Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w+\\s+]).{8,}$')]],
      ConfirmPassword: ['', [Validators.required], Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w+\\s+]).{8,}$')],
      GEMSMemberNumber: ['', Validators.required],
      MemberIDNumber: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      Referrals: ['', Validators.required],
    }, {
      //validator: this.helper.confirmedValidator('Password', 'ConfirmPassword')
    });

    /*
     Screen Mode 1
     */

    this.otpForm = this.fb.group({
      OTPPin: ['', [Validators.required, Validators.minLength(5)]],
    });

  };

  getRefferalOptions() {
    console.log('Loaded Options');
    this.api.getRefferalOptions()
    .subscribe(res => {
      console.log(res);
      this.refferalOptions = JSON.parse(res.data);
      console.log(this.refferalOptions);
    }, error => {
      console.log(error);
    })
  }

  register = () => {
    this.registrationForm.value.Referrals.$$hashKey = 'object:143';
    this.registrationForm.value.Platform = 'Member Portal';
    // @TODO Refractor code below
    this.registrationForm.value.Referral = this.registrationForm.value.Referrals;
    //this.isLoading = true;
    this.api.sendOTP(this.registrationForm.value)
      .subscribe(res => {
        console.log(res);
        // this.isLoading = false;
        this.registrationResponse = JSON.parse(res.data);
        this.screenMode = RegistrationStatus.VERIFICATION;
      }, error => {
        console.log(error);
      });
  };

  submitOTP = () => {
    console.log(this.otpForm.value);
    this.registrationResponse.OTPPin = this.otpForm.value.OTPPin;
    // console.log(this.registrationResponse);

    //this.isLoading = true;
    this.api.submitOTP(this.registrationResponse)
      .subscribe(res => {
        // console.log(res);
        if (res.data === 'valid') {
          this.api.register(this.registrationForm.value)
            .subscribe(response => {
              console.log(res);
              this.registrationResponse = JSON.parse(response.data);
              this.helper.presentToast('Account Created! Please log into your new account using your username and password.');
              this.router.navigateByUrl('/');
            }, error => {
              console.log(error);
              this.helper.presentToast(error.error.Message);
              this.screenMode = RegistrationStatus.REG_SCREEN;
            });

        } else {
          this.helper.presentToast('OTP is invalid');
        }
      }, error => {
        console.log(error);
        this.helper.presentToast('There was a network error, please try again');
      });
  };

  public errorHandling = (control: string, error: string) => {
    if (this.registrationForm.controls[control].dirty) {
      return this.registrationForm.controls[control].hasError(error);
    } 
  };

  public otpErrorHandling = (control: string, error: string) => {
    if (this.otpForm.controls[control].dirty) {
    return this.otpForm.controls[control].hasError(error);
    }
  };

  async showLoader() {
    this.loadingIndicator = await this.helper.showLoader();
  }

}
