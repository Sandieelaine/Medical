import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {
  count = 25

  constructor() {
    console.log(this.count);
  }

  ngOnInit() {
    this.countDown();
  }

  countDown() {
    setTimeout(() => {
      this.count--;
      console.log(this.count);
      if (this.count > 0) {
        this.countDown();
      }
    }, 1000);
  }







  ionViewDidEnter() {

  }

  

}
