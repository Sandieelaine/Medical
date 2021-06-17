import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authorisation } from 'src/app/models/authorisation.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-authorisation',
  templateUrl: './authorisation.page.html',
  styleUrls: ['./authorisation.page.scss'],
})
export class AuthorisationPage implements OnInit {
  authorisations:Authorisation[];
  authorisationsBackup:Authorisation[];
  automaticClose = true;
  isLoading = false;
  fakeAuthorisationList:Authorisation[] = [
    {
      AuthID: 0,
      AuthType: "CHRONIC",
      DOA: "2016-01-11T00:00:00+02:00",
      Description: null,
      PracticeProviderName: "COMMUNITY HEALTH SERVICE ORGAN",
      ReferenceNo: "DHVTE000043946",
      Status: "U",
      Title: "COMMUNITY HEALTH SERVICE ORGAN",
      MedicationName: "Centrum"
    },
    {
      AuthID: 0,
      AuthType: "CHRONIC",
      DOA: "2016-01-11T00:00:00+02:00",
      Description: null,
      PracticeProviderName: "COMMUNITY HEALTH SERVICE ORGAN",
      ReferenceNo: "DHVTE000043946",
      Status: "U",
      Title: "COMMUNITY HEALTH SERVICE ORGAN",
      MedicationName: "Centrum"
    },
    {
      AuthID: 0,
      AuthType: "CHRONIC",
      DOA: "2016-01-11T00:00:00+02:00",
      Description: null,
      PracticeProviderName: "COMMUNITY HEALTH SERVICE ORGAN",
      ReferenceNo: "DHVTE000043946",
      Status: "U",
      Title: "COMMUNITY HEALTH SERVICE ORGAN",
      MedicationName: "Centrum"
    },
  ]

  member:Member = null;

  constructor(private api: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.api.trackView('/', 'Benefits Page');
    this.member = this.api.getMember();
    console.log(this.member);
    this.loadAuthorisations();
  }

  doRefresh(e?) {
    this.loadAuthorisations();
    e.target.complete();
  }

  loadAuthorisations() {
    this.isLoading = true;

    this.api.getAuthorisations(this.member.MemberGuid, this.member.access_token).subscribe(authorisations => {
      console.log(authorisations);
      this.authorisationsBackup = JSON.parse(authorisations.data);
        this.authorisations = [...this.authorisationsBackup];
      // Load Fake Authorisations
      // this.authorisationsBackup = this.fakeAuthorisationList;
      // Load Fake Authorisations
      if (JSON.parse(authorisations.data).length > 0) {
        
        this.authorisations[0].open = true;
        console.log(this.authorisations);
      }
      
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  toggleSection(index) {
    this.authorisations[index].open = !this.authorisations[index].open;

    if (this.automaticClose && this.authorisations[index].open) {
      this.authorisations.filter((theItem, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  filterBenefits(e: CustomEvent) {
    this.authorisations = [...this.authorisationsBackup];
    console.log(e);
    console.log(this.authorisations);
    let value = e.detail.value;
    console.log(value);
    this.authorisations = this.authorisations.filter(currentBenefit => {
      if (currentBenefit.Description && value !== ' ') {
        return (currentBenefit.Description.toLowerCase().indexOf(value.toLowerCase()) > -1);
      } else {
        this.authorisations = [...this.authorisationsBackup];
      }
    })
  }

}
