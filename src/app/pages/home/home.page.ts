import { Member } from './../../models/member.model';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FullMember } from 'src/app/models/fullmember.model';
import { JoyrideService } from 'ngx-joyride';
import { JoyrideOptions } from 'ngx-joyride/lib/models/joyride-options.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  member:Member = null;
  profile: FullMember;
  exploreOpt = {
    slidesPerView: 2.1,
    spaceBetween: 8
  }
  testData;
  constructor(private auth: AuthenticationService, private storage: Storage, private zone: NgZone, private alertCtrl: AlertController, private router: Router, private readonly joyrideService: JoyrideService) {}


  ngOnInit() {
    this.auth.trackEvent('Documents', 'Play', 'Member Certificate')
    this.auth.trackView('/', 'Home Page');
    this.member = this.auth.getMember();
    console.log(this.member);
    this.loadProfile();
    this.startTour();
  }


  async startTour() {
    const options: JoyrideOptions = {
      steps: ['welcome','claims', 'benefits', 'profile', 'downloads', 'help', 'authorisations'],
      // waitingTime: 2,
      themeColor:'#174575'
    };

    const stored = await this.storage.get('hasSeenGEMSTour');
    if (stored || stored !== undefined || null) {
      this.joyrideService.startTour(options);
    }
  }

  loadProfile() {
    this.auth.getMemberProfile(this.member.MemberGuid, this.member.access_token)
    .subscribe(profile => {
      this.profile = JSON.parse(profile.data);
    })
  }

  async showAlert() {
    // let tour = await this.storage.get('hasSeenTour');
    //console.warn(tour, 'tour');
    // if (tour == null) {
      let tourAlert = await this.alertCtrl.create({
        header: 'Home Page',
        // tslint:disable-next-line: max-line-length
        subHeader: 'Get quick access to your claims, downloads, help and more on this page.',
        buttons: [
          {
            text: 'Skip',
            handler: async () => {
              // let disableTour = await this.storage.set('hasSeenTour', true);
            }
          },
          {
            text: 'Continue',
            handler: () => {
              this.zone.run(async () => {
                this.router.navigateByUrl('/tabs/tabs/profile');
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
