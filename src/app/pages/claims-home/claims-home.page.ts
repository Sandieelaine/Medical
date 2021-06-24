import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-claims-home',
  templateUrl: './claims-home.page.html',
  styleUrls: ['./claims-home.page.scss'],
})
export class ClaimsHomePage implements OnInit {
  MemberImage;
  selectedMember;
  profile: FullMember = null;
  dateStatus = "from";
  dateFrom = "2021-6-12";
  dateTill = "2021-6-14";
  claims:any;
  claimsBackup: any;
  automaticClose = true;
  isLoading = false;
  member:Member = null;

  constructor(private api: AuthenticationService, private router: Router, private helper: HelpersService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getFullProfile();
    this.getClaimsByDate();
  }

  ionViewDidEnter() {
    
  }

  getFullProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      console.log(profile.data);
    }, err => {
      console.log(err);
    });
  }

  getClaimsByDate() {
    this.isLoading = true;
    this.api.getClaimsByDate(this.dateFrom, this.dateTill, this.member.MemberGuid, this.member.access_token)
    .subscribe(claims => {
      console.log(JSON.parse(claims.data));
      this.claimsBackup = JSON.parse(claims.data);
      this.claims = [...this.claimsBackup];
      this.isLoading = false;
    }, err => {
      console.log(err);
      this.helper.presentToast(JSON.parse(err.error).Message);
    })
  }

  doRefresh(e?) {
    this.isLoading = true;
    this.getClaimsByDate();
    e.target.complete();
  }

  toggleSection(index) {
    this.claims[index].open = !this.claims[index].open;

    if (this.automaticClose && this.claims[index].open) {
      this.claims.filter((theItem, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  filterUpdate(e:CustomEvent) {
    console.log(e.detail.value);
    this.claims = [...this.claimsBackup];
    console.log(e);
    console.log(this.claims);
    let value = e.detail.value;
    console.log(value);
    if (value === "pending") {
      value === null;
      this.claims = this.claims.filter(currentClaim => {
          return !currentClaim.Status;
      });
    } else if (value === "all") {
      this.claims = [...this.claimsBackup];
    } else {
      this.claims = this.claims.filter(currentClaim => {
        if (currentClaim.Status && value !== ' ') {
          return (currentClaim.Status.toLowerCase().indexOf(value.toLowerCase()) > -1);
        } else {
          this.claims = [...this.claimsBackup];
        }
      });
    }
    
  }

}
