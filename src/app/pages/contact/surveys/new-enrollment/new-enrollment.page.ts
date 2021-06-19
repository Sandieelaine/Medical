import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-new-enrollment',
  templateUrl: './new-enrollment.page.html',
  styleUrls: ['./new-enrollment.page.scss'],
})
export class NewEnrollmentPage implements OnInit {
  newEnrollmentForm:FormGroup;
  member:Member = null;
  loader;

  constructor(private api: AuthenticationService, private fb: FormBuilder, private loadingCtrl: LoadingController, private helper: HelpersService, private router: Router) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeForm();
  }

  initializeForm() {
    this.newEnrollmentForm = this.fb.group({
      areYouSatisfiedWithJoinProcess: ['', [Validators.required]], // Username must not contain any spaces
      isCardInfoCorrect: ['', [Validators.required]],
      isInformationEnough: ['', [Validators.required]]
    });
  }

  areYouSatisfiedWithJoinProcess(e:CustomEvent) {
    console.log(e.detail.value);
    this.newEnrollmentForm.patchValue({areYouSatisfiedWithJoinProcess: e.detail.value});
  }

  isCardInfoCorrect(e:CustomEvent) {
    console.log(e.detail.value);
    this.newEnrollmentForm.patchValue({isCardInfoCorrect: e.detail.value});
  }

  isInformationEnough(e:CustomEvent) {
    console.log(e.detail.value);
    this.newEnrollmentForm.patchValue({isInformationEnough: e.detail.value});
  }

  submitFeedback() {
    this.showLoader();
    const payload = this.newEnrollmentForm.value;
    console.log(payload);
    this.api.submitSatisfactionSurveyNewEnrollment(payload, this.member.MemberGuid, this.member.access_token)
    .subscribe(async res => {
      await this.loadingCtrl.dismiss();
      await this.helper.presentToast('Thank you for taking part in our survey');
      await this.router.navigateByUrl('/tabs/tabs/home');
    }, async err => {
      await this.loadingCtrl.dismiss();
      await this.helper.presentToast('Failed to submit your feedback. Please try again!');
    });
  }


  async showLoader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Loading',
      cssClass: 'login-spinner'
    });
    this.loader.present();
  }

}
