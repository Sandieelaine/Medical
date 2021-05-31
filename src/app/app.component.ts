import { AuthenticationService } from './services/authentication.service';
import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  secondsLeft;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public api: AuthenticationService,
    private screenOrientation: ScreenOrientation,
    private idle: Idle, private keepalive: Keepalive,
    private router: Router,
    private alertCtrl: AlertController

  ) {
    this.initializeApp();
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5000);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(25);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => {
      if(countdown === 25) {
        this.showAlert(this.secondsLeft);
      }    
      this.secondsLeft = countdown;
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log('You will time out in ' + countdown + ' seconds!')
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#0a2d52');
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.api.startTrackerWithId("UA-82679314-1");
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });
  }

  logout() {
    this.api.logout();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  async showAlert(seconds) {
    // ${this.secondsLeft || 0}
      let tourAlert = await this.alertCtrl.create({
        header: `Profile Page ${this.secondsLeft || 0}`,
        subHeader: seconds,
        buttons: [
          {
            text: 'End Tour',
            handler: () => {
              // this.zone.run(async () => {
              //   this.router.navigateByUrl('/tabs/tabs/home');
              //   return false;
              // });
            }
          }
        ]
      });
      await tourAlert.present();
  }
}
