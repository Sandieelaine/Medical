import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-evo-option',
  templateUrl: './evo-option.page.html',
  styleUrls: ['./evo-option.page.scss'],
})
export class EvoOptionPage implements OnInit {
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
