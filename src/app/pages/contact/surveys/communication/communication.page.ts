import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage implements OnInit {
  communicationForm:FormGroup;
  member:Member = null;
  loader;
  commTools = [
    "SMS - General Information Alerts",
    "SMS - Claims Processed Notification",
    "SMS - Happy Birthday",
    "SMS - Pre-registration",
    "SMS - Dependants turning/over 21",
    "SMS - Outstanding contributions",
    "Member handbook",
    "Newsletter for HR practitioners",
    "Newsletter for members",
    "Communication about year-end benefit and option changes",
    "Website",
    "Member statements"
  ];

  constructor(private api: AuthenticationService, private fb: FormBuilder, private loadingCtrl: LoadingController, private helper: HelpersService, private router: Router) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeForm();
  }

  initializeForm() {
    this.communicationForm = this.fb.group({
      CommunicationToolRate: ['', [Validators.required]],
      CommunicationTool: ['', [Validators.required]]
    });
  }

  CommunicationToolRate(e:CustomEvent) {
    console.log(e.detail.value);
    this.communicationForm.patchValue({CommunicationToolRate: e.detail.value});
  }

  CommunicationTool(e:CustomEvent) {
    console.log(e.detail.value);
    this.communicationForm.patchValue({CommunicationTool: e.detail.value});
  }


  submitFeedback() {
    this.showLoader();
    const payload = this.communicationForm.value;
    console.log(payload);
    this.api.submitSatisfactionSurveyCommunication(payload, this.member.MemberGuid, this.member.access_token)
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
