import { Member } from './../../models/member.model';
import { Activity } from './../../models/activity.model';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FullMember } from 'src/app/models/fullmember.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = 'member';
  member;
  activity;
  dayToDayBenefits;
  MemberImage;
  selectedMember;
  profile: FullMember = null;
  benefit;
  documents;
  slideOpt = {
    slidesPerView: 2.5,
    spaceBetween: 10
  };

  constructor(private auth: AuthenticationService, private storage: Storage, private zone: NgZone, private alertCtrl: AlertController, private router: Router) {
    
  }

  ionViewWillEnter() {
    // window.location.reload();
    
  }

  ionViewDidEnter() {
    this.getFullProfile();
    this.loadBenefits();
    this.getActivity();
    this.loadDocuments();
  }

  ngOnInit() {
    // this.setUpData();
  }

  async setUpData() {
      let check = await this.auth.user.subscribe(res => {
        if (res ) {
          console.log(res);
          if (res !== null || res !== undefined) {
            this.getFullProfile();
            this.loadBenefits();
            this.getActivity();
            this.loadDocuments();
          }
        } else {
          this.router.navigateByUrl('/tabs/tabs/home');
        }
      })
  }

  doRefresh(e) {
    this.zone.run(async () => {
    this.auth.user.subscribe(res => {
      if (res ) {
        this.getFullProfile();
        this.loadBenefits();
        this.getActivity();
        this.loadDocuments();
        e.target.complete();
      } else {
        this.router.navigateByUrl('/tabs/tabs/home');
      }
    })
  });
  }


  getFullProfile() {
    this.auth.getMemberFullProfile().subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      console.log(profile.data);
    }, err => {
      console.log(err);
    });
  }

  getActivity() {
    this.auth.getMemberActivity('1')
    .subscribe(res => {
      this.activity = JSON.parse(res.data);
      console.log(res);
    }, error => {
      console.log(error);
    })
  }

  loadBenefits() {
    this.auth.getDayToDayBenefits().subscribe(res => {
      console.log(res);
      this.dayToDayBenefits = JSON.parse(res.data);
      console.log(res);
    }, err => {
      console.log(err);
      this.auth.presentToast(err.error, 5000);
    });
  }

  loadDocuments() {
    this.auth.getAllDocuments().subscribe(documents => {
      this.documents = JSON.parse(documents.data);
      console.log(this.documents);
    }, err => {
      console.log(err);
    });
  }

  logout() {
    this.auth.logout();
  }


  async showAlert() {
    // //let tourDelete = await this.storage.remove('hasSeenTour');
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

  

}
