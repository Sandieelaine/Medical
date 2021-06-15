import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact, suggestionsOrImprovements } from 'src/app/models/contact.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-compliments',
  templateUrl: './compliments.page.html',
  styleUrls: ['./compliments.page.scss'],
})
export class ComplimentsPage implements OnInit {
  contactOptions:Contact;
  complimentsForms:FormGroup;
  suggestionsImprovementsCategories:suggestionsOrImprovements;
  subCategories;
  complaintOrComplimentType = [
    {
      name: 'Compliment'
    },
    {
      name: 'Complaint'
    }
  ];

  constructor(private api: AuthenticationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.loadContactOptions();
    this.loadSuggestionsImprovementsCategories();
    this.initializeForm();
    this.onCategoryChanges();
  }

  initializeForm() {
    this.complimentsForms = this.fb.group({
      CaseTypeDescription: ['', [Validators.required]],
      Category: ['', [Validators.required]],
      SubCategory: ['', [Validators.required]],
      UserInput: ['', [Validators.required]]
    });
  }

  loadContactOptions() {
    this.api.getContactOptions()
    .subscribe(res => {
      //console.log(res);
      this.contactOptions = JSON.parse(res.data);
    }, err => {
      console.log(err);
    });
  }

  loadSuggestionsImprovementsCategories() {
    this.api.getSuggestionsImprovementsCategories()
    .subscribe(res => {
      console.log(res);
      this.suggestionsImprovementsCategories = JSON.parse(res.data);
    }, err => {
      console.log(err);
    });
  }

  submitComplaintOrCompliment() {
    console.log(this.complimentsForms.value);
  }

  public errorHandling = (control: string, error: string) => {
    if (this.complimentsForms.controls[control].dirty) {
      return this.complimentsForms.controls[control].hasError(error);
    } 
  };

  onCategoryChanges(): void {
    this.complimentsForms.get('Category').valueChanges.subscribe(val => {
      console.log(val);
      if(val) {
        this.complimentsForms.patchValue({SubCategory: ''});
        this.subCategories = val.SubCategories;
      }
    });
  }

}
