import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.page.html',
  styleUrls: ['./claims.page.scss'],
})
export class ClaimsPage implements OnInit {
  claimsAmendmentsForm:FormGroup;
  member:Member = null;
  loader;

  constructor(private api: AuthenticationService, private fb: FormBuilder, private loadingCtrl: LoadingController, private helper: HelpersService, private router: Router) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeForm();
  }

  initializeForm() {
    this.claimsAmendmentsForm = this.fb.group({
      isClaimProcessedCorrectly: ['', [Validators.required]], // Username must not contain any spaces
      isClaimProcessedQuickly: ['', [Validators.required]]
    });
  }

  isClaimProcessedCorrectly(e:CustomEvent) {
    console.log(e.detail.value);
    this.claimsAmendmentsForm.patchValue({isClaimProcessedCorrectly: e.detail.value});
  }

  isClaimProcessedQuickly(e:CustomEvent) {
    console.log(e.detail.value);
    this.claimsAmendmentsForm.patchValue({isClaimProcessedQuickly: e.detail.value});
  }

  submitFeedback() {
    this.showLoader();
    const payload = this.claimsAmendmentsForm.value;
    console.log(payload);
    this.api.submitSatisfactionSurveyClaims(payload, this.member.MemberGuid, this.member.access_token)
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
