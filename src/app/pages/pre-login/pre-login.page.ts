import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-pre-login',
  templateUrl: './pre-login.page.html',
  styleUrls: ['./pre-login.page.scss'],
})
export class PreLoginPage implements OnInit {
  titles;

  constructor(private api: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.getPreLoginInformation();
  }

  getPreLoginInformation() {
    this.api.loadPreloginInformation()
    .subscribe(res => {
      console.log(res);
      this.titles = res;
    })
  }

  goToNextPage(content) {
    this.api.selectedPreLoginContent = content;
    if(content) {
      this.router.navigateByUrl('/pre-login/option')
    }
  }

}
