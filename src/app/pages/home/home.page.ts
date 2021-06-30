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
  profile: FullMember = null;
  exploreOpt = {
    slidesPerView: 2.1,
    spaceBetween: 8
  }
  testData;
  posts;
  showOptionChangeMessage = true;
  constructor(public auth: AuthenticationService, private storage: Storage, private zone: NgZone, private alertCtrl: AlertController, private router: Router, private readonly joyrideService: JoyrideService) {}

  // ionViewDidEnter() {
  //   this.member = this.auth.getMember();
  //   console.log(this.auth.loggedInMember);
  //   console.log(this.member);
  // }

  // ionViewWillEnter() {
  //   this.member = this.auth.getMember();
  //   console.log(this.auth.loggedInMember);
  //   console.log(this.member);
  // }

  ngOnInit() {
    this.auth.trackEvent('Documents', 'Play', 'Member Certificate')
    this.auth.trackView('/', 'Home Page');
    this.member = this.auth.getMember();
    console.log(this.auth.loggedInMember);
    console.log(this.member);
    this.loadProfile();
    this.getNews();
    // this.startTour();
  }

  getNews() {
    this.auth.loadNews()
    .subscribe(res => {
      console.log(res);
      this.posts = res;
    }, err => {
      console.log(err);
    })
  }


  async startTour() {
    const options: JoyrideOptions = {
      steps: ['welcome','claims', 'benefits', 'profile', 'downloads', 'help', 'authorisations', 'bottomtabs', 'hometab', 'profiletab@tabs/tabs/profile', 'memberdetails'],
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
      if ((this.profile.isChangePlanAvailable && this.profile.optionChangeEvoOnly && this.profile.Plan.BenefitPlanName !== 'EMERALD') || this.profile.isChangePlanAvailable === false) {
        this.showOptionChangeMessage = false;
      }
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

  navigateToPost(post) {
    if (post) {
      this.auth.selectedNewsPost = post;
      this.router.navigate(['/', 'home','hello'])
    }
    

  }



}
