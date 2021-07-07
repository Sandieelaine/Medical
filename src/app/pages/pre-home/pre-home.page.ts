import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-pre-home',
  templateUrl: './pre-home.page.html',
  styleUrls: ['./pre-home.page.scss'],
})
export class PreHomePage implements OnInit {
  member: Member;

  constructor(private router: Router, private zone: NgZone, private api: AuthenticationService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    console.log(this.member);
  }

  navigateToHome() {
    this.zone.run(async () => {
      this.router.navigateByUrl('/tabs/tabs/home');
      return false;
    });
  }

  updateProfile() {
    this.router.navigate(['tabs', 'tabs', 'profile', 'edit', this.member?.MemberGuid]);
  }

}
