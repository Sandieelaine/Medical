import { Member } from './../../models/member.model';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FullMember } from 'src/app/models/fullmember.model';
import { JoyrideService } from 'ngx-joyride';
import { JoyrideOptions } from 'ngx-joyride/lib/models/joyride-options.class';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  member:Member = null;
  profile: FullMember = null;
  exploreOpt = {
    slidesPerView: 3,
    spaceBetween: 8
  }
  testData;
  posts;
  showOptionChangeMessage = true;
  constructor(public auth: AuthenticationService, private zone: NgZone, private alertCtrl: AlertController, private router: Router, private readonly joyrideService: JoyrideService) {}

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
    // this.showGuide();
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
      steps: ['welcome','claims', 'benefits', 'profile'],
      // waitingTime: 2,
      themeColor:'#174575'
    };

      this.joyrideService.startTour(options);
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

  async showGuide() {
    const hasSeenGuide = await Storage.get({key: 'guide-seen'});
    if (hasSeenGuide && (hasSeenGuide.value === 'true')) {
      console.log('guide seen');
    } else {
      this.startTour();
    }
  }

  navigateToPost(post) {
    if (post) {
      this.auth.selectedNewsPost = post;
      this.router.navigate(['/', 'home','hello'])
    }
    

  }



}
