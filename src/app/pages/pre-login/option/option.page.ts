import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {
  content;
  automaticClose = true;
  options = [];

  constructor(private api: AuthenticationService) { }

  ngOnInit() {
    console.log(this.api.selectedPreLoginContent);
    this.content = this.api.selectedPreLoginContent;
    this.options = this.content.content;
  }

  toggleSection(index) {
    this.options[index].open = !this.options[index].open;

    if (this.automaticClose && this.options[index].open) {
      this.options.filter((theItem, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

  learnMore(url:string) {
    window.open(url, '_blank');
  }

}
