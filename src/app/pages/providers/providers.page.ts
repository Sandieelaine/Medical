import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapMarker
} from '@angular/google-maps';
declare var google;

@Component({
  selector: 'app-providers',
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
})
export class ProvidersPage implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapInfoWindow) info: MapInfoWindow;
  zoom = 15;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'terrain',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
    styles: [
      {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [
              {
                  saturation: 36
              },
              {
                  color: '#333333'
              },
              {
                  lightness: 40
              }
          ]
      },
      {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [
              {
                  visibility: 'on'
              },
              {
                  color: '#ffffff'
              },
              {
                  lightness: 16
              }
          ]
      },
      {
          featureType: 'all',
          elementType: 'labels.icon',
          stylers: [
              {
                  visibility: 'off'
              }
          ]
      },
      {
          featureType: 'administrative',
          elementType: 'geometry.fill',
          stylers: [
              {
                  color: '#fefefe'
              },
              {
                  lightness: 20
              }
          ]
      },
      {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [
              {
                  color: '#fefefe'
              },
              {
                  lightness: 17
              },
              {
                  weight: 1.2
              }
          ]
      },
      {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
              {
                  color: '#f5f5f5'
              },
              {
                  lightness: 20
              }
          ]
      },
      {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
              {
                  color: '#f5f5f5'
              },
              {
                  lightness: 21
              }
          ]
      },
      {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [
              {
                  color: '#dedede'
              },
              {
                  lightness: 21
              }
          ]
      },
      {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
              {
                  color: '#ffffff'
              },
              {
                  lightness: 17
              }
          ]
      },
      {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
              {
                  color: '#ffffff'
              },
              {
                  lightness: 29
              },
              {
                  weight: 0.2
              }
          ]
      },
      {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [
              {
                  color: '#ffffff'
              },
              {
                  lightness: 18
              }
          ]
      },
      {
          featureType: 'road.local',
          elementType: 'geometry',
          stylers: [
              {
                  color: '#ffffff'
              },
              {
                  lightness: 16
              }
          ]
      },
      {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [
              {
                  color: '#f2f2f2'
              },
              {
                  lightness: 19
              }
          ]
      },
      {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
              {
                  color: '#e9e9e9'
              },
              {
                  lightness: 17
              }
          ]
      }
  ]
  };
  slideOptions = {
    slidesPerView: 1.3,
    initialSlide: 0,
    speed: 400,
    spaceBetween: 15
  };
  markers = [{
      position: {
        lat: -26.1907318,
        lng: 28.0701989,
      },
      label: {
        color: 'red',
        text: 'Marker label ',
      },
      title: 'Marker title ',
      options: {
        animation: google.maps.Animation.DROP,
        // icon: {
        //     url: 'https://www.pngkey.com/png/full/336-3360782_sapphire-gems-medical-aid-options.png',
        //     size: {
        //         height: 14,
        //         width: 14
        //     }
        // }
      },
    },
    {
      position: {
        lat: -26.2023995,
        lng: 28.0683964,
      },
      label: {
        color: 'red',
        text: 'Marker label ',
      },
      title: 'Marker title ',
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    }
  ];
  infoContent = '';

  constructor() {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) {
      this.zoom++;
    }
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) {
      this.zoom--;
    }
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.info.open(marker);
  }

}
