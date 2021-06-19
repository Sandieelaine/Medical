import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-walk-in-centres',
  templateUrl: './walk-in-centres.page.html',
  styleUrls: ['./walk-in-centres.page.scss'],
})
export class WalkInCentresPage implements OnInit {
  walkInCentreForm:FormGroup;
  member:Member = null;
  loader;
  regions;
  walkInCentres;
  walkInCentresImmutable;

  constructor(private api: AuthenticationService, private fb: FormBuilder, private loadingCtrl: LoadingController, private helper: HelpersService, private router: Router) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getRegions();
    this.getWalkinCentres();
    this.initializeForm();
    this.onRegionChanges();
  }

  initializeForm() {
    this.walkInCentreForm = this.fb.group({
      Region: ['', [Validators.required]],
      WalkinCentre: ['', [Validators.required]],
      didHelpDeskAgentHelpSolveProblem: ['', [Validators.required]],
      wasTheAgentFriendlyAndProfessional: ['', [Validators.required]],
      wereYouHelpedOnTime: ['', [Validators.required]]
    });
  }

  didHelpDeskAgentHelpSolveProblem(e:CustomEvent) {
    console.log(e.detail.value);
    this.walkInCentreForm.patchValue({didHelpDeskAgentHelpSolveProblem: e.detail.value});
  }

  wasTheAgentFriendlyAndProfessional(e:CustomEvent) {
    console.log(e.detail.value);
    this.walkInCentreForm.patchValue({wasTheAgentFriendlyAndProfessional: e.detail.value});
  }

  wereYouHelpedOnTime(e:CustomEvent) {
    console.log(e.detail.value);
    this.walkInCentreForm.patchValue({wereYouHelpedOnTime: e.detail.value});
  }

  submitFeedback() {
    this.showLoader();
    const payload = this.walkInCentreForm.value;
    console.log(payload);
    this.api.submitSatisfactionSurveyWalkInCentre(payload, this.member.MemberGuid, this.member.access_token)
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

  getRegions() {
    this.api.getAllWalkInCentreOptions(this.member.access_token)
    .subscribe(regions => {
      this.regions = JSON.parse(regions.data).Provinces;
      console.log(this.regions);
    })
  }

  getWalkinCentres() {
    this.api.getAllWalkInCentres(this.member.access_token)
    .subscribe(walkInCentres => {
      this.walkInCentresImmutable = JSON.parse(walkInCentres.data);
      // this.walkInCentres = this.walkInCentresImmutable;
      console.log(this.walkInCentres);
    })
  }

  onRegionChanges(): void {
    this.walkInCentreForm.get('Region').valueChanges.subscribe(val => {
      this.walkInCentreForm.patchValue({'WalkinCentre': ''})
      console.log(val);
      this.walkInCentres = [...this.walkInCentresImmutable];
      let value = val;
      console.log(value);
      this.walkInCentres = this.walkInCentres.filter(currentWalkInCentre => {
        if (currentWalkInCentre.Province.Description && value !== ' ') {
          return (currentWalkInCentre.Province.Description.toLowerCase().indexOf(value.toLowerCase()) > -1);
        } else {
          // this.benefits = [...this.benefitsBackup];
        }
      })
    });
  }

}

