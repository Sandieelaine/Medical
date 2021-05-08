import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})
export class WalkthroughPage implements OnInit {
  @ViewChild('slides', {static: false}) slides: IonSlides;
  slideOpts = {
    pager: true
  };


  constructor() { }

  ngOnInit() {
  }

  goToSlide(a?: number) {
    console.log('Helklo');
    //this.slides.slideTo(a);
    this.slides.slideNext();
  }

}
