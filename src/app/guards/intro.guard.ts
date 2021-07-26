import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
// import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) {}
  async canLoad(): Promise<boolean> {
    const hasSeenIntro = await Storage.get({key: 'intro-seen'});
    if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', {replaceUrl: true});
      return true;
    }
  }
}
