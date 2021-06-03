import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private api: AuthenticationService) {

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.api.member.pipe(
        take(1),
        tap((user) => {console.log(user)}),
        map(user => {
          console.log(user);
          if (!user) {
            this.router.navigateByUrl('/');
            return false;
          } else {
            return true;
          }
        })
      )
  }
}
