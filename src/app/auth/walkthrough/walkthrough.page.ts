import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})
export class WalkthroughPage implements OnInit {
  @ViewChild('slides', {static: false}) slides: IonSlides;
  slideOpts = {
    pager: true,
    initialSlide: 0,
  };


  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToSlide(a?: number) {
    console.log('Helklo');
    this.slides.startAutoplay();
    // this.slides.slideTo(2);
    this.slides.slideNext();
  }

  async continueToApp() {
    await Storage.set({key: 'intro-seen', value: 'true'});
    this.router.navigateByUrl('/onboard', {replaceUrl: true});
  }

}
