import { Component, OnInit } from '@angular/core';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
})
export class PersonalInformationPage implements OnInit {
  member:Member = null;
  profile: FullMember = null;
  MemberImage = null;

  constructor(private api: AuthenticationService) { }

  ngOnInit() {
    this.member = this.api.getMember();
  }

  getMemberProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      // console.log(this.profile);
    }, err => {
      // console.log(err);
    });
  }

}
