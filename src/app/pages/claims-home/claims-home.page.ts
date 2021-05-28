import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FullMember } from 'src/app/models/fullmember.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
  dateFrom = "2021-1-1";
  dateTill = "2021-2-2";
  claims:any;
  automaticClose = true;
  isLoading = false;

  constructor(private api: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getFullProfile();
    this.getClaimsByDate();
  }

  getFullProfile() {
    this.api.getMemberFullProfile().subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      console.log(profile.data);
    }, err => {
      console.log(err);
    });
  }

  getClaimsByDate() {
    this.isLoading = true;
    this.api.getClaimsByDate(this.dateFrom, this.dateTill)
    .subscribe(claims => {
      console.log(JSON.parse(claims.data));
      this.claims = JSON.parse(claims.data);
      this.isLoading = false;
    }, err => {
      console.log(err);
    })
  }

  doRefresh(e?) {
    this.isLoading = true;
    this.api.user.subscribe(res => {
      if (res ) {
        this.getClaimsByDate();
        e.target.complete();
      } else {
        this.router.navigateByUrl('/tabs/tabs/home');
      }
    })
  }

  toggleSection(index) {
    this.claims[index].open = !this.claims[index].open;

    if (this.automaticClose && this.claims[index].open) {
      this.claims.filter((theItem, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

}
