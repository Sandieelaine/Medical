import { Member } from './../../models/member.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EvoOptionPage } from './evo-option/evo-option.page';
import { NonevoOptionPage } from './nonevo-option/nonevo-option.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FullMember } from 'src/app/models/fullmember.model';

@Component({
  selector: 'app-option-change',
  templateUrl: './option-change.page.html',
  styleUrls: ['./option-change.page.scss'],
})
export class OptionChangePage implements OnInit {
  member: Member = null;
  profile:FullMember = null;

  constructor(private router: Router, private api: AuthenticationService) { }

  ngOnInit() {
    this.api.trackView('/', 'Option Change Landing Page');
    this.member = this.api.getMember();
    console.log(this.member);
    this.loadProfile();
  }

  changeOption(option, optionStatus) {
    this.router.navigate(['tabs', 'tabs', 'option-change', option, optionStatus]).then(res => {
      console.log('Navigated');
    })
  }

  loadProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token)
    .subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      console.log(this.profile);
    })
  }

}
