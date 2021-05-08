import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.page.html',
  styleUrls: ['./benefits.page.scss'],
})
export class BenefitsPage implements OnInit {
  benefits;
  benefitsBackup;
  loader;
  items:any[] = [{name: 'Hello'}, {name: 'Hello'}, {name: 'Hello'}, {name: 'Hello'}, {name: 'Hello'}];
  automaticClose = true;

  constructor(private api: AuthenticationService, private loadingCtrl: LoadingController, private router: Router, private auth: AuthenticationService) {
    
  }

  ngOnInit() {
    this.auth.user.subscribe(res => {
      if (res ) {
        this.loadBenefits();
      } else {
        this.router.navigateByUrl('/tabs/tabs/home');
      }
    })
  }

  doRefresh(e?) {
    this.auth.user.subscribe(res => {
      if (res ) {
        this.loadBenefits();
        e.target.complete();
      } else {
        this.router.navigateByUrl('/tabs/tabs/home');
      }
    })
  }

  loadBenefits() {
    this.showLoader();
    this.api.getBenefits().subscribe(benefits => {
      this.benefitsBackup = JSON.parse(benefits.data);
      this.benefits = [...this.benefitsBackup];
      this.benefits[0].open = true;
      console.log(this.benefits);
      this.loader.dismiss();
    }, error => {
      console.log(error);
      this.loader.dismiss();
    });
  }

  async showLoader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'circles'
    })
    this.loader.present();
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


}
