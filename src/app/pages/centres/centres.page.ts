import { WalkInCentre } from './../../models/walk-in-centres.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

declare var google;

@Component({
  selector: 'app-centres',
  templateUrl: './centres.page.html',
  styleUrls: ['./centres.page.scss'],
})
export class CentresPage implements OnInit {
  @ViewChild('map', { static: true }) mapContainer: ElementRef;
  map: any;
  centres: WalkInCentre[] = [];

  constructor(private api: AuthenticationService) { }

  ngOnInit() {
    this.getCentres();
    this.displayGoogleMap();
  }

  getCentres() {
    this.api.getAllWalkInCentres()
    .subscribe(centres => {
      this.centres = JSON.parse(centres.data);
      console.log(this.centres);
      this.getMarkers();
    })
  }

  displayGoogleMap() {
    const latLng = new google.maps.LatLng(-33.2420546,9.1368633);

    const mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  }

  getMarkers() {
    // tslint:disable-next-line:variable-name
    for (let _i = 0; _i < this.centres.length; _i++) {
      if (_i > 0) {
        this.addMarkersToMap(this.centres[_i]);
      }
    }
  }

  addMarkersToMap(centre:WalkInCentre) {
    let latlong = centre.LatitudeLongitude;
    let latitude = Number(latlong.substr(0, latlong.indexOf(',')))
    let longitude = Number(latlong.split(',')[1]);
    console.log(latitude, longitude);
    setTimeout(() => {
      const position = new google.maps.LatLng(latitude, longitude);
      const museumMarker = new google.maps.Marker({ position, title: `${centre.AddressLine1}, ${centre.AddressLine4}`, icon: '/assets/img/marker.png' });
      console.log(position);
      museumMarker.setMap(this.map);
    }, 1000);
    
  }

}
