import { Component, OnInit } from '@angular/core';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {

  constructor() { }

  ngOnInit() {
    confetti.create()({
      shapes: ['circle', 'circle', 'square'],
      particleCount: 300,
      spread: 90,
      origin: {
          y: (1),
          x: (0.5)
      }
  });
  }

  ionViewDidEnter() {
    confetti.create()({
      shapes: ['circle', 'circle', 'square'],
      particleCount: 300,
      spread: 90,
      origin: {
          y: (1),
          x: (0.5)
      }
  });
  }

}
