import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from 'src/app/models/member.model';
import { FullMember } from 'src/app/models/fullmember.model';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.page.html',
  styleUrls: ['./benefits.page.scss'],
})
export class BenefitsPage implements OnInit {
  benefits:BenefitUsage[];
  benefitsBackup:BenefitUsage[];
  loader;
  items:any[] = [{name: 'Hello'}, {name: 'Hello'}, {name: 'Hello'}, {name: 'Hello'}, {name: 'Hello'}];
  automaticClose = true;
  isLoading = false;


  member:Member = null;
  profile:FullMember = null

  /*Modified*/
  generalBenefits:any[]=[];
  unlimitedBenefits:any[]=[];
  majorBenefit!:any;
  acuteMedBenefit!:any;
  chronicMedBenefit!:any;
  selfMedBenefit!:any;
  medicationGauges!:any;


  unlimitedBenefitsStaticArr:any[]=[];
  generalBenefitsStaticArr:any[]=[];

  constructor(private api: AuthenticationService, private router: Router) {
    
  }

  ngOnInit() {
    this.api.trackView('/', 'Benefits Page');
    this.member = this.api.getMember();
    console.log(this.member);
    this.loadBenefits();
    this.getMemberProfile();
  }

  doRefresh(e?) {
    this.loadBenefits();
    e.target.complete();
  }

  loadBenefits() {
    this.isLoading = true;

    this.api.getBenefits(this.member.MemberGuid, this.member.access_token).subscribe(benefits => {
      this.benefitsBackup = JSON.parse(benefits.data);
      this.benefits = [...this.benefitsBackup];
      // this.benefits[0].open = true;
      this.buildBenefitSets();
      console.log(this.majorBenefit, 'majorb');
      console.log(this.benefits);
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  toggleSection(index) {
    this.benefits[index].open = !this.benefits[index].open;

    if (this.automaticClose && this.benefits[index].open) {
      this.benefits.filter((theItem, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  filterBenefits(e: CustomEvent) {
    this.benefits = [...this.benefitsBackup];
    console.log(e);
    console.log(this.benefits);
    let value = e.detail.value;
    console.log(value);
    this.benefits = this.benefits.filter(currentBenefit => {
      if (currentBenefit.Description && value !== ' ') {
        return (currentBenefit.Description.toLowerCase().indexOf(value.toLowerCase()) > -1);
      } else {
        this.benefits = [...this.benefitsBackup];
      }
    })
  }

  getMemberProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      console.log(this.profile);
    }, err => {
      // console.log(err);
      this.api.presentToast(err.error, 5000);
    });
  }

  buildBenefitSets() {

    for (var i = 0; i < this.benefits.length; i++) {
        var benefit = this.benefits[i];
        if (benefit.IsMajor) {
            this.majorBenefit = benefit;
            if (this.majorBenefit) {
              this.majorBenefit.open = false;
            }
        } else if (benefit.IsAcuteMedication) {
            this.acuteMedBenefit = benefit;
        } else if (benefit.IsChronicMedication) {
            this.chronicMedBenefit = benefit;
        } else if (benefit.IsSelfMedication) {
            this.selfMedBenefit = benefit;
        } else if (benefit.DisplayType === 2 && !benefit.ShowBeneficiaryLevel) {
            this.unlimitedBenefits.push(benefit);
            // if(this.unlimitedBenefits.length > 0) {

            // }
        }
        else {
            this.generalBenefits.push(benefit);
        }
    }

    this.unlimitedBenefits.forEach((item: any) => {
        this.unlimitedBenefitsStaticArr.push(item);
    });

    this.generalBenefits.forEach((item: any) => {
        this.generalBenefitsStaticArr.push(item);
    });
}

availableAmountForBenefit = function(benefit: any)
{
    var amount = benefit.MaxAmount.Amount - benefit.UsedAmount.Amount;
    if (amount < 0) {
        amount = 0;
    }
    return amount;
}

availableUnitsForBenefit = function (benefit: any) {
    var amount = benefit.MaxUnits - benefit.UsedUnits;
    if (amount < 0)
    {
        amount = 0;
    }
    return amount;
}

//search reset function
resetInput = (e: any) => {
  this.unlimitedBenefits = [...this.unlimitedBenefitsStaticArr];
  this.generalBenefits = [...this.generalBenefitsStaticArr];
};

toggleMajorBenefitSection() {
  this.majorBenefit.open = !this.majorBenefit.open;

  // if (this.automaticClose && this.benefits[index].open) {
  //   this.benefits.filter((theItem, itemIndex) => itemIndex != index)
  //   .map(item => item.open = false);
  // }
}

toggleUnlimitedBenefitsSection(index) {
  this.unlimitedBenefits[index].open = !this.unlimitedBenefits[index].open;

  if (this.automaticClose && this.unlimitedBenefits[index].open) {
    this.unlimitedBenefits.filter((theItem, itemIndex) => itemIndex != index)
    .map(item => item.open = false);
  }
}

toggleGeneralBenefitsSection(index) {
  this.generalBenefits[index].open = !this.generalBenefits[index].open;

  if (this.automaticClose && this.generalBenefits[index].open) {
    this.generalBenefits.filter((theItem, itemIndex) => itemIndex != index)
    .map(item => item.open = false);
  }
}


}
