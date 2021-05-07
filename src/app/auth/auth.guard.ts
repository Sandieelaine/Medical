import { AuthenticationService } from './../services/authentication.service';
import { Injectable, NgZone } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private auth: AuthenticationService, private router: Router, private zone: NgZone) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]):
    Observable<boolean> | Promise<boolean> | boolean {
      if (this.auth.isAuthenticated() === true) {
        this.zone.run(res => {
          this.router.navigateByUrl('/tabs/tabs/home');
          return true;
        })
      } else if (this.auth.isAuthenticated() === false) {
        this.zone.run(res => {
          this.router.navigateByUrl('/onboard');
          return false;
        })
      } else {
        this.zone.run(res => {
          this.router.navigateByUrl('/onboard');
          return false;
        })
      }
      return this.auth.isAuthenticated();
    }
}