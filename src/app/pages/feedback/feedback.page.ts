import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedbackForm:FormGroup;
  @ViewChild('rating', {static: true}) rating : any;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.feedbackForm = this.fb.group({
      didyouexperienceanyissue: ['', [Validators.required]], // Username must not contain any spaces
      isyourdatacomplete: ['', [Validators.required]],
      isyourdatacorrect: ['', [Validators.required]],
      howwouldyouratethenewmemberportalmobileapp: ['', [Validators.required]],
    });
  }

  onUpdateExperience(e:CustomEvent) {
    console.log(e.detail.value);
    this.feedbackForm.patchValue({didyouexperienceanyissue: e.detail.value});
  }

  onUpdateDataCorrect(e:CustomEvent) {
    console.log(e.detail.value);
    this.feedbackForm.patchValue({isyourdatacorrect: e.detail.value});
  }

  onUpdateDataComplete(e:CustomEvent) {
    console.log(e.detail.value);
    this.feedbackForm.patchValue({isyourdatacomplete: e.detail.value});
  }

  submitFeedback() {
    const payload = this.feedbackForm.value;
    payload.howwouldyouratethenewmemberportalmobileapp = +payload.howwouldyouratethenewmemberportalmobileapp * 2;
    console.log(payload);
  }

  logRatingChange(e) {
    console.log(e);
    this.feedbackForm.patchValue({howwouldyouratethenewmemberportalmobileapp: e});
  }
}
