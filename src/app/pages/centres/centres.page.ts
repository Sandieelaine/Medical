import { WalkInCentre } from './../../models/walk-in-centres.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Plugins } from '@capacitor/core';
import { Member } from 'src/app/models/member.model';
import { HelpersService } from 'src/app/services/helpers.service';
const { Geolocation } = Plugins;

declare var google;

@Component({
  selector: 'app-centres',
  templateUrl: './centres.page.html',
  styleUrls: ['./centres.page.scss'],
})
export class CentresPage implements OnInit {
  @ViewChild('map', { static: true }) mapContainer: ElementRef;
  map: any;
  coordinates;
  centres: WalkInCentre[] = [];
  member:Member = null;
  slideOptions = {
    slidesPerView: 1.4,
    initialSlide: 0,
    speed: 400,
    spaceBetween: 15
  };
  infoWindow;

  constructor(private api: AuthenticationService, private helpers: HelpersService) { }

  ionViewWillEnter() {
    this.getCentres();
  }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getCurrentPosition();
    this.api.trackView('/', 'Walk In Centres');
  }

  getCentres() {
    this.helpers.presentLoadingIndicator('Loading', true);
    this.api.getAllWalkInCentres(this.member.access_token)
    .subscribe(centres => {
      this.helpers.hideLoadingIndicator();
      this.centres = JSON.parse(centres.data);
      console.log(this.centres);
    }, err => {
      this.helpers.hideLoadingIndicator();
    });
  }

  displayGoogleMap() {
    let userLat = -25.7582737
    let userLong = 28.0578637;
    if (this.coordinates.latitude && this.coordinates.longitude) {
      userLat = this.coordinates.coords.latitude;
      userLong = this.coordinates.coords.longitude;
    }
    
    const latLng = new google.maps.LatLng(userLat, userLong);

    const mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.getMarkers();
    
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
      const centresMarker = new google.maps.Marker({ position, title: `${centre.AddressLine1}, ${centre.AddressLine4}`, icon: '/assets/img/marker.png' });
      this.addInfoWindow(centresMarker,
        `<span class="font-bold text-sm block">${centre.AddressLine1}</span>
        <span class="font-bold">Address: </span>
        <span>${centre.AddressLine1},${centre.AddressLine2},${centre.AddressLine3},${centre.AddressLine4}</span>
        <span class="font-bold block">Operating Hours:</span>
        <span class="block"><b>Midweek:  </b>${centre.OperatingHours.MidWeek}</span>
        <span class="block"><b>Saturday:  </b>${centre.OperatingHours.Saturday}</span>
        <div onclick="window.open('https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}', '_blank')" class="text-xs p-2 bg-gems-primary-blue flex items-center text-white font-bold mt-2 rounded-full justify-center">GET DIRECTIONS</div>
        `
        );
      console.log(position);
      centresMarker.setMap(this.map);
    }, 1000);
    
  }


  // https://www.google.com/maps/search/?api=1&query=Mediclinic%20Potchefstroom
  async getCurrentPosition() {
    this.coordinates = await Geolocation.getCurrentPosition();
    const displayMap = await this.displayGoogleMap();
    console.log(this.coordinates);  
  }

  addInfoWindow(marker, content) {
    if (this.infoWindow) {
      this.infoWindow.close();
  }
    this.infoWindow = new google.maps.InfoWindow({
      content
    });
    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.open(this.map, marker);
    });
  }

  getSelectedLocation(lat, long) {
    window.open('https://www.google.com/maps/search/?api=1&query=Mediclinic%20Potchefstroom', '_blank');
  }

}
