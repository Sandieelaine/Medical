import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
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
  title = 'MR';
  firstName = 'John';
  lastName = 'Doie';
  DOB = '02/10/2001';
  memberNo = '1234567';
  baseURL;
  DocURLUpload

  member:Member = null;

  constructor(private api: AuthenticationService, private helper: HelpersService) {
    this.baseURL = this.api.url;
  }

  ngOnInit() {
    this.member = this.api.getMember();
  }

  submitClaim() {
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
          console.log(e);
            let b64 = e.target.result.toString().split("base64,")[1];
            this.base64Doc = b64;
            console.log(this.base64Doc);
            this.api.submitClaim(this.docName, this.base64Doc, this.member.MemberGuid, this.member.access_token)
            .subscribe(res => {
              console.log(res);
              this.helper.presentToast('Claim Submitted Successfully');
            }, err => {
              console.log(err);
              this.helper.presentToast('Claim Submission Failed');
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

}
