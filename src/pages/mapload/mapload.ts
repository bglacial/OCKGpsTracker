import { Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import { NavController,NavParams} from 'ionic-angular';
//import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
//import { Geolocation, Geoposition} from '@ionic-native/geolocation';
import {Sqlite} from '../../providers/sqlite';
import 'rxjs/add/operator/filter';

declare var google;

@Component({
    selector: 'mapload-page',
    templateUrl: 'mapload.html'
})
export class MapLoadPage {

    public watch:any;
    public lat:number = 0;
    public lng:number = 0;
    public speed:string = '0.00';

    sessionId;
    sessionDetails = [];

    @ViewChild('map') mapElement:ElementRef;
    map:any;

    constructor(public navCtrl:NavController, public zone:NgZone, public params:NavParams, public sqliteService:Sqlite) {
        this.sessionId = this.params.get('sessionId');
    }

    ionViewDidLoad() {
        this.loadMap();
    }

    loadMap() {

        this
            .sqliteService
            .getSessionDetail(this.sessionId)
            .then(s => {
                this.sessionDetails = this.sqliteService.arrSessionDetail;
            });


        /* this.geolocation.getCurrentPosition().then((position) => {

         console.log(position);
         let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

         let mapOptions = {
         center: latLng,
         zoom: 16,
         mapTypeId: google.maps.MapTypeId.ROADMAP
         };

         this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

         }, (err) => {
         console.log('Error : ');
         console.log(err.message);
         alert('Error map : ' + err.message);
         });*/

    }

    addMarker(position) {

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        });
        this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

        let content = "<h4>Vitesse : " + (position.coords.speed * 3.6).toFixed(2) + "Km/h </h4>";

        this.addInfoWindow(marker, content);

    }

    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }
}