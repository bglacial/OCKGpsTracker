import { Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition} from '@ionic-native/geolocation';
import {Sqlite} from '../../providers/sqlite';
import 'rxjs/add/operator/filter';

declare var google;

@Component({
    selector: 'mapaction-page',
    templateUrl: 'mapaction.html'
})
export class MapActionPage {

    public watch:any;
    public lat:number = 0;
    public lng:number = 0;
    public speed:string = '0.00';

    @ViewChild('map') mapElement:ElementRef;
    map:any;

    constructor(public navCtrl:NavController, public zone:NgZone, public geolocation:Geolocation, public backgroundGeolocation:BackgroundGeolocation, public sqliteService:Sqlite) {

    }

    ionViewDidLoad() {
        this.loadMap();
        this.startTracking();
    }

    start() {
        this.startTracking();
    }

    stop() {
        this.stopTracking();
    }

    reset() {
        this.resetTracking();
    }

    loadMap() {

        this.geolocation.getCurrentPosition().then((position) => {

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
        });

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

    startTracking() {

        this.sqliteService.addSession();
        // Background Tracking

        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 10,
            distanceFilter: 1,
            debug: true,
            interval: 200
        };
        this.backgroundGeolocation.configure(config).subscribe((location) => {

            console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
                this.speed = (location.speed * 3.6).toFixed(2);
            });

        }, (err) => {

            console.log(err);

        });

        // Foreground Tracking
        let options = {
            frequency: 100,
            enableHighAccuracy: true
        };

        this.watch = this.geolocation.watchPosition(options).filter((p:any) => p.code === undefined).subscribe((position:Geoposition) => {
            console.log(this.sqliteService.lastSessionId);

            if (position.coords.speed == null) {
                var speed = 0;
            } else {
                var speed = parseFloat((position.coords.speed * 3.6).toFixed(2));
            }
            this.sqliteService.addSessionDetail(this.sqliteService.lastSessionId, position, speed);
            this.addMarker(position);
            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.speed = (position.coords.speed * 3.6).toFixed(2);
            });

        });
    }

    stopTracking() {

        console.log('stopTracking');

        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();

    }

    resetTracking() {

        console.log('resetTracking');
        this.stopTracking();
        this.map = null;
        this.loadMap();
        this.start();

    }
}