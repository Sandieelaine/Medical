import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-submit-claim',
  templateUrl: './submit-claim.page.html',
  styleUrls: ['./submit-claim.page.scss'],
})
export class SubmitClaimPage implements OnInit {
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  selectedFile;
  title = 'MR';
  firstName = 'John';
  lastName = 'Doie';
  DOB = '02/10/2001';
  memberNo = '1234567';

  constructor() { }

  ngOnInit() {
  }

  uploadFileEvt(event: any) {
    console.log(event);
    const files: FileList = event.target.files;
    const file = files[0].arrayBuffer().then(res => {
      console.log(res)
      // Converts arraybuffer to typed array object
      const TYPED_ARRAY = new Uint8Array(res);

      // converts the typed array to string of characters
        const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
      
      //converts string of characters to base64String
        let base64String = btoa(STRING_CHAR);
        console.log(base64String);
    });
    const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //     console.log(reader.result);
    // };
    console.log(reader.result);
    this.selectedFile = file;
    console.log(file);


  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

}
