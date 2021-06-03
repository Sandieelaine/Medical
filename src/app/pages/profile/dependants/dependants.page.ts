import { Component, OnInit } from '@angular/core';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dependants',
  templateUrl: './dependants.page.html',
  styleUrls: ['./dependants.page.scss'],
})
export class DependantsPage implements OnInit {
  member:Member;
  dependants;

  constructor(private api: AuthenticationService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getMemberProfile();
  }

  getMemberProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      let memberProfile:FullMember = JSON.parse(profile.data);
      this.dependants = memberProfile.Dependants;
      //this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      // console.log(this.profile);
    }, err => {
      // console.log(err);
    });
  }

}
