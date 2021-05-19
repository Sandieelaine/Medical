import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-submit-claim',
  templateUrl: './submit-claim.page.html',
  styleUrls: ['./submit-claim.page.scss'],
})
export class SubmitClaimPage implements OnInit {
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  docName;
  base64Doc;
  title = 'MR';
  firstName = 'John';
  lastName = 'Doie';
  DOB = '02/10/2001';
  memberNo = '1234567';
  baseURL;

  constructor(private api: AuthenticationService) {
    this.baseURL = this.api.url;
  }

  ngOnInit() {
  }

  uploadFileEvt(event: any) {
    event.stopPropagation();
    console.log(event);
    const files: FileList = event.target.files;
    console.log(files[0].size);
    this.docName = files[0].name;
    const file = files[0].arrayBuffer().then(res => {
      console.log(res)
      // Converts arraybuffer to typed array object
      const TYPED_ARRAY = new Uint8Array(res);
      // converts the typed array to string of characters
        const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
      
      //converts string of characters to base64String
        let base64String = btoa(STRING_CHAR);
        this.base64Doc = base64String;
        console.log(base64String);
    });
    const reader = new FileReader();
  }

  submitClaim() {
    if(this.base64Doc && this.docName) {
      this.api.submitClaim(this.docName, this.base64Doc)
      .subscribe(res => {
        console.log(res);
      }, err => {

      })
    }
    
  }

}
