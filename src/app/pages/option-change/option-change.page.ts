import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EvoOptionPage } from './evo-option/evo-option.page';
import { NonevoOptionPage } from './nonevo-option/nonevo-option.page';

@Component({
  selector: 'app-option-change',
  templateUrl: './option-change.page.html',
  styleUrls: ['./option-change.page.scss'],
})
export class OptionChangePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  changeOption(option, optionStatus) {
    this.router.navigate(['option-change', option, optionStatus]).then(res => {
      console.log('Navigated');
    })
  }

}
