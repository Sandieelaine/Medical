import { Component, Input, OnInit } from '@angular/core';
import { FullMember } from 'src/app/models/fullmember.model';

@Component({
  selector: 'digital-member-card',
  templateUrl: './digital-member-card.component.html',
  styleUrls: ['./digital-member-card.component.scss'],
})
export class DigitalMemberCardComponent implements OnInit {
  @Input() member: FullMember
  @Input() planName:string;

  constructor() { }

  ngOnInit() {}

}
