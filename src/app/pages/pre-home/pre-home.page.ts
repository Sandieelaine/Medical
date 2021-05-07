import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-pre-home',
  templateUrl: './pre-home.page.html',
  styleUrls: ['./pre-home.page.scss'],
})
export class PreHomePage implements OnInit {

  constructor(private router: Router, private zone: NgZone) { }

  ngOnInit() {
  }

  navigateToHome() {
    this.zone.run(async () => {
      this.router.navigateByUrl('/tabs/tabs/home');
      return false;
    });
  }

}
