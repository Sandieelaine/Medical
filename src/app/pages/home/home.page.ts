import { Member } from './../../models/member.model';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { faCamera, faBaby, faHandshake, faFileContract, faCoins, faEye, faHandHoldingUsd, faSearchLocation, faHeartbeat, faUserTie, faPaperPlane, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  member;
  exploreOpt = {
    slidesPerView: 2.1,
    spaceBetween: 8
  }
  constructor(private auth: AuthenticationService, private storage: Storage, private zone: NgZone, private alertCtrl: AlertController, private router: Router) {
    this.auth.getSelectedMember()
    .subscribe(res => {
      console.log('promised', res);
    })
  }

  ngOnInit() {
    this.auth.trackView('/', 'Home Page');
    this.showAlert();
    this.storage.get('member').then(res => {
      console.log(JSON.parse(res.data));
      const parsedData = JSON.parse(res.data);
      this.member = parsedData;
    })
  }

  async showAlert() {
    // //let tourDelete = await this.storage.remove('hasSeenTour');
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
      // await tourAlert.present();
    //}
  }



}
