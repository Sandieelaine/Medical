import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { LoadingController, Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  documents;
  loader;

  constructor(private auth: AuthenticationService, private loadingCtrl: LoadingController, private platform: Platform, private fileOpener: FileOpener, private file: File) { }

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.showLoader();
    this.auth.getAllDocuments().subscribe(docs => {
      this.documents = JSON.parse(docs.data);
      console.log(this.documents);
      this.loader.dismiss();
    }, error => {
      this.loader.dismiss();
    });
  }

  openDoc(doc: string) {

  }

  downloadMemberCertificate(certificateID) {
    this.auth.getMemberCertificate()
    .subscribe(res => {
      console.log(res);

      // Check first if running on Android
      if(this.platform.is("android")) {
        console.log('Running on android');
        this.file.writeFile(
          this.file.externalRootDirectory + "/Download",
          `${certificateID}.pdf`,
          new Blob([res.data]),
          {
            replace: true
          }
        ).then(res => {
          console.log(res)
          console.log(this.file.externalRootDirectory + "/Download" + `/${certificateID}.pdf`);
          this.fileOpener.open(
              this.file.externalRootDirectory + "/Download" + `/${certificateID}.pdf`, "application/pdf"
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
          `${certificateID}.pdf`,
          new Blob([res.data]),
          {
            replace: true
          }
        ).then(res => {
          console.log(res)
          console.log(this.file.documentsDirectory + `/${certificateID}.pdf`);
          this.fileOpener.open(
              this.file.documentsDirectory + `/${certificateID}.pdf`, "application/pdf"
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


  downloadTaxCertificate(certificateID, year) {
    this.auth.getTaxCertificate(year)
    .subscribe(res => {
      console.log(res);

      // Check first if running on Android
      if(this.platform.is("android")) {
        console.log('Running on android');
        this.file.writeFile(
          this.file.externalRootDirectory + "/Download",
          `${certificateID}-${year}.pdf`,
          new Blob([res.data]),
          {
            replace: true
          }
        ).then(res => {
          console.log(res)
          console.log(this.file.externalRootDirectory + "/Download" + `/${certificateID}-${year}.pdf`);
          this.fileOpener.open(
              this.file.externalRootDirectory + "/Download" + `/${certificateID}-${year}.pdf`, "application/pdf"
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
          `${certificateID}-${year}.pdf`,
          new Blob([res.data]),
          {
            replace: true
          }
        ).then(res => {
          console.log(res)
          console.log(this.file.documentsDirectory + `/${certificateID}-${year}.pdf`);
          this.fileOpener.open(
              this.file.documentsDirectory + `/${certificateID}-${year}.pdf`, "application/pdf"
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
      spinner: 'bubbles',
      backdropDismiss: true
    });
    this.loader.present();
  }

}
