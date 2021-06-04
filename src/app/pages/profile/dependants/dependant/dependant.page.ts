import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dependant',
  templateUrl: './dependant.page.html',
  styleUrls: ['./dependant.page.scss'],
})
export class DependantPage implements OnInit {
  dependant;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      const dependant = paramMap.get('Dependant');
      console.log(dependant);
      this.dependant = dependant;
      console.log(JSON.parse(dependant));
      
    });
  }

  ngOnInit() {
  }

}
