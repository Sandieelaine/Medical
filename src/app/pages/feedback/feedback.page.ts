import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Member } from 'src/app/models/member.model';
import { HelpersService } from 'src/app/services/helpers.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedbackForm:FormGroup;
  @ViewChild('rating', {static: true}) rating : any;
  member:Member = null;
  loader;

  constructor(private fb: FormBuilder, private api: AuthenticationService, private helper: HelpersService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeForm();
  }

  initializeForm() {
    this.feedbackForm = this.fb.group({
      didyouexperienceanyissue: ['', [Validators.required]], // Username must not contain any spaces
      isyourdatacomplete: ['', [Validators.required]],
      isyourdatacorrect: ['', [Validators.required]],
      howwouldyouratethenewmemberportalmobileapp: ['', [Validators.required]],
    });
  }

  onUpdateExperience(e:CustomEvent) {
    console.log(e.detail.value);
    this.feedbackForm.patchValue({didyouexperienceanyissue: e.detail.value});
    if (e.detail.value) {
      this.feedbackForm.addControl('didyouexperienceanyissuecomment', new FormControl('', Validators.required));
    } else {
      this.feedbackForm.removeControl('didyouexperienceanyissuecomment');
    } 
  }

  onUpdateDataCorrect(e:CustomEvent) {
    console.log(e.detail.value);
    this.feedbackForm.patchValue({isyourdatacorrect: e.detail.value});
    if (e.detail.value) {
      this.feedbackForm.removeControl('isyourdatacorrectcomment');
    } else {
      this.feedbackForm.addControl('isyourdatacorrectcomment', new FormControl('', Validators.required));
    } 
  }

  onUpdateDataComplete(e:CustomEvent) {
    console.log(e.detail.value);
    this.feedbackForm.patchValue({isyourdatacomplete: e.detail.value});
    if (e.detail.value) {
      this.feedbackForm.removeControl('isyourdatacompletecomment');
    } else {
      this.feedbackForm.addControl('isyourdatacompletecomment', new FormControl('', Validators.required));
    } 
  }

  submitFeedback() {
    this.showLoader();
    const payload = this.feedbackForm.value;
    payload.howwouldyouratethenewmemberportalmobileapp = +payload.howwouldyouratethenewmemberportalmobileapp * 2;
    console.log(payload);
    this.api.submitSurveyFeedback(payload, this.member.MemberGuid, this.member.access_token)
    .subscribe(async res => {
      await this.loadingCtrl.dismiss();
      await this.helper.presentToast('Thank you for taking part in our survey');
      await this.router.navigateByUrl('/tabs/tabs/home');
    }, async err => {
      await this.loadingCtrl.dismiss();
      await this.helper.presentToast('Failed to submit your feedback. Please try again!');
    });
  }

  logRatingChange(e) {
    console.log(e);
    this.feedbackForm.patchValue({howwouldyouratethenewmemberportalmobileapp: e});
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
