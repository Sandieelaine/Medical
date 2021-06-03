import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { LoadingController, Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { HelpersService } from 'src/app/services/helpers.service';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  documents;
  loader;
  isLoading = true;
  member:Member;

  constructor(private auth: AuthenticationService, private loadingCtrl: LoadingController, private platform: Platform, private fileOpener: FileOpener, private file: File, private helper: HelpersService) { }

  ngOnInit() {
    this.member = this.auth.getMember();
    this.loadDocuments();

  }

  loadDocuments() {
    this.auth.getAllDocuments(this.member.MemberGuid, this.member.access_token).subscribe(docs => {
      this.documents = JSON.parse(docs.data);
      console.log(this.documents);
      this.isLoading = false;
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  openDoc(doc: string) {

  }

  downloadMemberCertificate(certificateID) {
    this.showLoader();
    this.auth.getMemberCertificate(this.member.MemberGuid, this.member.access_token)
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
          this.loader.dismiss();
          this.helper.presentToast('Document Downloaded to Downloads Folder', 2000);
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
          this.loader.dismiss();
          console.log(err);
          alert('Document Download Failed. Please try again');
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
          this.loader.dismiss();
          this.helper.presentToast('Document Downloaded to Downloads Folder', 2000);
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
          this.loader.dismiss();
          console.log(err);
          alert('Document Download Failed. Please try again');
        })
      }
      
    }, err => {
      console.log(err);
      this.loader.dismiss();
      alert('Document Download Failed. Please try again');
    })
  }


  downloadTaxCertificate(certificateID, year) {
    this.auth.getTaxCertificate(year, this.member.MemberGuid, this.member.access_token)
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
          alert('Document Download Failed. Please try again')
        })
      }
      
    }, err => {
      console.log(err);
    })
  }

  async showLoader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Downloading Document',
      cssClass: 'login-spinner'
    });
    this.loader.present();
  }



}
