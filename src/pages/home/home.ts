import { Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition} from '@ionic-native/geolocation';
import { LocationTracker } from '../../providers/location-tracker';
import 'rxjs/add/operator/filter';

declare var google;

@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})
export class HomePage {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    public speed: number = 0;

    @ViewChild('map') mapElement: ElementRef;
    map: any;

    constructor(public navCtrl: NavController, public zone: NgZone, public geolocation: Geolocation, public locationTracker: LocationTracker, public backgroundGeolocation: BackgroundGeolocation) {

    }

    ionViewDidLoad(){
        this.loadMap();
    }

    start(){
        this.startTracking();
    }

    stop(){
        this.stopTracking();
    }

    reset(){
        this.resetTracking();
    }
    loadMap(){

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
            console.log(err);
        });

    }
    addMarker(position){

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        });
        this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        let content = "<h4>Vitesse : </h4>"+position.coords.speed * 3.6;

        this.addInfoWindow(marker, content);

    }
    addInfoWindow(marker, content){

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

    startTracking() {

        // Background Tracking

        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 1,
            debug: true,
            interval: 1000
        };
        this.backgroundGeolocation.configure(config).subscribe((location) => {

            console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
                this.speed = location.speed * 3.6;
            });

        }, (err) => {

            console.log(err);

        });

        // Foreground Tracking
        let options = {
            frequency: 200,
            enableHighAccuracy: true
        };

        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

            console.log(position);

            this.addMarker(position);
            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.speed = position.coords.speed * 3.6;
            });

        });
    }
    stopTracking() {

        console.log('stopTracking');

        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();

    }
    resetTracking(){

        console.log('resetTracking');
        this.stopTracking();
        this.map = null;
        this.loadMap();
        this.start();

    }
}