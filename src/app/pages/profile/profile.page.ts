import { Member } from './../../models/member.model';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FullMember } from 'src/app/models/fullmember.model';
import { HelpersService } from 'src/app/services/helpers.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = 'member';
  member: Member = null;
  activity = null;
  dayToDayBenefits = null;
  MemberImage = null;
  selectedMember;
  profile: FullMember = null;
  benefit;
  documents;
  loadingIndicator
  slideOpt = {
    slidesPerView: 2.5,
    spaceBetween: 10
  };

  constructor(private auth: AuthenticationService, private storage: Storage, private zone: NgZone, private alertCtrl: AlertController, private router: Router, private loadingCtrl:LoadingController, private helper: HelpersService) {
    
  }

  ionViewWillEnter() {
    
    
  }

  ngOnInit() {
    this.auth.trackView('/', '360 View Page');
    this.member = this.auth.getMember();
    this.getMemberProfile();
    this.getActivity();
    this.loadBenefits();
  }

  getMemberProfile() {
    this.showLoader();
    this.auth.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      // console.log(this.profile);
      this.loadingCtrl.dismiss();
    }, err => {
      // console.log(err);
      this.loadingCtrl.dismiss();
      this.auth.presentToast(err.error, 5000);
    });
  }


  doRefresh(e) {
    this.getMemberProfile();
    this.getActivity();
    this.loadBenefits();
    e.target.complete();
  }


  getActivity() {
    this.auth.getMemberActivity(this.member.MemberGuid, this.member.access_token, 1)
    .subscribe(res => {
      this.activity = JSON.parse(res.data);
      // console.log(res);
    }, err => {
      // console.log(error);
      this.auth.presentToast(err.error, 5000);
    })
  }

  loadBenefits() {
    this.auth.getMemberDayToDayBenefits(this.member.MemberGuid, this.member.access_token).subscribe(res => {
      console.log(res);
      this.dayToDayBenefits = JSON.parse(res.data);
      // console.log(res);
    }, err => {
      // console.log(err);
      this.auth.presentToast(err.error, 5000);
    });
  }

  loadDocuments() {
    this.auth.getAllDocuments(this.member.MemberGuid, this.member.access_token).subscribe(documents => {
      this.documents = JSON.parse(documents.data);
      // console.log(this.documents);
    }, err => {
      // console.log(err);
      this.auth.presentToast(err.error, 5000);
    });
  }

  logout() {
    this.auth.logMemberOut();
  }


  async showAlert() {
    // let tour = await this.storage.get('hasSeenTour');
    //console.warn(tour, 'tour');
    // if (tour == null) {
      let tourAlert = await this.alertCtrl.create({
        header: 'Profile Page',
        // tslint:disable-next-line: max-line-length
        subHeader: 'Get access to your balances, dependants information and a lot more at your fingertips.',
        buttons: [
          {
            text: 'End Tour',
            handler: () => {
              this.zone.run(async () => {
                this.router.navigateByUrl('/tabs/tabs/home');
                return false;
              });
            }
          }
        ]
      });
      await tourAlert.present();
    //}
  }

  async showLoader() {
    this.loadingIndicator = await this.helper.showLoader('Loading your profile');
  }

  

}
