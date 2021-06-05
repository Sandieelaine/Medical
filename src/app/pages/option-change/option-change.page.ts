import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EvoOptionPage } from './evo-option/evo-option.page';
import { NonevoOptionPage } from './nonevo-option/nonevo-option.page';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-option-change',
  templateUrl: './option-change.page.html',
  styleUrls: ['./option-change.page.scss'],
})
export class OptionChangePage implements OnInit {

  constructor(private router: Router, private api: AuthenticationService) { }

  ngOnInit() {
    this.api.trackView('/', 'Option Change Landing Page');
  }

  changeOption(option, optionStatus) {
    this.router.navigate(['tabs', 'tabs', 'option-change', option, optionStatus]).then(res => {
      console.log('Navigated');
    })
  }

}
