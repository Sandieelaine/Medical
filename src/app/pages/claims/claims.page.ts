import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, PickerController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-claims',
  templateUrl: './claims.page.html',
  styleUrls: ['./claims.page.scss'],
})
export class ClaimsPage implements OnInit {
  claims;
  loader;
  claimState = 'statements';
  history;
  statements;
  submit;
  claimsHistory:any[] = [{name: 'Claim'}, {name: 'Claim'}, {name: 'Claim'}, {name: 'Claim'}];
  automaticClose;

  constructor(
    private api: AuthenticationService,
    private loadingCtrl: LoadingController,
    private router: Router,
    public pickerCtrl: PickerController,
    private fileOpener: FileOpener,
    private file: File,
    private platform: Platform) {
    this.claimsHistory[0].open = true;
  }

  ngOnInit() {
    this.api.user.subscribe(res => {
      if (res ) {
        this.loadClaimsStatements();
        // this.loadClaimsHistory();
      } else {
        this.router.navigateByUrl('/tabs/tabs/home');
      }
    })   
  }


  loadClaimsHistory() {
    this.showLoader();
    this.api.getClaimsHistory().subscribe(history => {
      this.claimsHistory = JSON.parse(history.data);
      console.log(this.claimsHistory);
      this.loader.dismiss();
    }, error => {
      console.log(error)
      this.loader.dismiss();
    });
  }


  loadClaimsStatements() {
    this.showLoader();
    this.api.getClaims().subscribe(claims => {
      this.claims = JSON.parse(claims.data);
      console.log(this.claims);
      this.loader.dismiss();
    }, error => {
      console.log(error)
      this.loader.dismiss();
    });
  }

  downloadClaimStatement(statementID) {
    this.api.getClaimStatement(statementID)
    .subscribe(res => {
      console.log(res);

      // Check first if running on Android
      if(this.platform.is("android")) {
        console.log('Running on android');
        this.file.writeFile(
          this.file.externalRootDirectory + "/Download",
          `${statementID}.pdf`,
          new Blob([res.data]),
          {
            replace: true
          }
        ).then(res => {
          console.log(res)
          console.log(this.file.externalRootDirectory + "/Download" + `/${statementID}.pdf`);
          this.fileOpener.open(
              this.file.externalRootDirectory + "/Download" + `/${statementID}.pdf`, "application/pdf"
          ).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          })
        }).catch(err => {
          console.log(err);
        })
      }

      // Check if running on iOS
      if(this.platform.is("ios")) {
        console.log('Running on iOS');
        this.file.writeFile(
          this.file.documentsDirectory,
          `${statementID}.pdf`,
          new Blob([res.data]),
          {
            replace: true
          }
        ).then(res => {
          console.log(res)
          console.log(this.file.documentsDirectory + `/${statementID}.pdf`);
          this.fileOpener.open(
              this.file.documentsDirectory + `/${statementID}.pdf`, "application/pdf"
          ).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          })
        }).catch(err => {
          console.log(err);
        })
      }
      
    }, err => {
      console.log(err);
    })
  }

  async showLoader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'circles'
    })
    this.loader.present();
  }

  segmentChanged(e) {
    console.dir(e);
    this.claimState = e.detail.value;
  }

  toggleSection(index) {
    this.claimsHistory[index].open = !this.claimsHistory[index].open;

    if (this.automaticClose && this.claimsHistory[index].open) {
      this.claimsHistory.filter((theItem, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  async statusPicker() {
    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Done',
        handler: res => {
          console.log(res);
        }
      }],
      columns: [{
        name: 'status',
        options: [
          {
            text: 'All Claims',
            value: 'all'
          },
          {
          text: 'Rejected',
          value: 'rejected'
        },
        {
          text: 'Approved',
          value: 'approved'
        },
        {
          text: 'Pending',
          value: 'pending'
        }]
      }]
    });
    await picker.present();
  }

}