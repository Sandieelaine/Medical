import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, ReplaySubject } from 'rxjs';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-submit-claim',
  templateUrl: './submit-claim.page.html',
  styleUrls: ['./submit-claim.page.scss'],
})
export class SubmitClaimPage implements OnInit {
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  docName;
  claimFile;
  base64Doc;
  profile:FullMember;
  title;
  firstName;
  lastName;
  DOB;
  memberNo;
  baseURL;
  DocURLUpload

  member:Member = null;

  constructor(private api: AuthenticationService, private helper: HelpersService, private loadingCtrl: LoadingController) {
    this.baseURL = this.api.url;
  }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getMemberProfile();
  }

  submitClaim() {
    this.helper.showLoader();
    console.log(this.claimFile);
    if (this.claimFile !== undefined) {
        this.docName = this.claimFile.name;
        var reader = new FileReader();
        // Get the original real FileReader. The polyfill saves a reference to it.
        const realFileReader = (reader as any)._realReader;

        // Make sure we were able to get the original FileReader 
        if (realFileReader) {
            // Swap out the polyfill instance for the original instance.
            reader = realFileReader;
        }
        reader.onloadend = (e) => {
          // console.log(e);
            let b64 = e.target.result.toString().split("base64,")[1];
            this.base64Doc = b64;
            // console.log(this.base64Doc);
            this.api.submitClaim(this.docName, this.base64Doc, this.member.MemberGuid, this.member.access_token)
            .subscribe(res => {
              this.loadingCtrl.dismiss();
              console.log(res);
              this.helper.presentToast('Claim Submitted Successfully');
            }, err => {
              this.loadingCtrl.dismiss();
              console.log(JSON.parse(err.error).Message);
              this.helper.presentToast(JSON.parse(err.error).Message);
            })

            
        };
        reader.readAsDataURL(this.claimFile);
    }
    else {
        alert("Please upload a document for your claim");
    }
};

uploadFileEvt(event) {
  console.log(event);
  if(event.target.files.length > 0) {
    if(event.target.files[0].size > 2000000) {
      alert("File selected exceeds the maximum size limit of 2MB");
      return;
    }
    this.claimFile = event.target.files[0];
  }
}


getMemberProfile() {
  this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
    this.profile = JSON.parse(profile.data);
    console.log(this.profile);
    this.title = this.profile.MemberTitle.Description;
    this.firstName = this.profile.FirstName;
    this.lastName = this.profile.LastName;
    this.DOB = this.profile.DOB.substring(0, 10);
    this.memberNo = this.profile.MemberNo;
  }, err => {
    // console.log(err);
  });
}

}
