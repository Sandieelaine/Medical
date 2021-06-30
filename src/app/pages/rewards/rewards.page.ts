import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {
  count = 25

  constructor(public api: AuthenticationService, public modalController: ModalController) {
    console.log(this.count);
  }

  ngOnInit() {
    // this.countDown();
  }

  countDown() {
    setTimeout(() => {
      this.count--;
      console.log(this.count);
      if (this.count > 0) {
        this.countDown();
      } else { 
        this.modalController.dismiss();
        this.api.logMemberOut();
      }
    }, 1000);
  }

  resetAndContinue() {
    this.api.reset();
    this.modalController.dismiss();
  }







  ionViewDidEnter() {

  }

  

}
