import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Platform} from 'ionic-angular';
import { MapActionPage } from '../mapaction/mapaction';
import { MapLoadPage } from '../mapload/mapload';
import {Sqlite} from '../../providers/sqlite';
import {GlobalVars} from '../../providers/globalvars';

declare var window:any;
declare var google;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    tabMapActionRoot = MapActionPage;
    tabMapLoadRoot = MapLoadPage;

    public todos = [];
    public text:any;

    constructor(public navCtrl:NavController, public sqliteService:Sqlite, protected platform:Platform, public globalVars:GlobalVars, public modalCtrl:ModalController) {
        //First We need to ready the Platform

        this
            .platform
            .ready()
            .then(() => {
                this
                    .sqliteService
                    .getSessions()
                    .then(s => {
                        this.todos = this.sqliteService.arr;
                    });
            })
    }

    add() {
        this
            .sqliteService
            .addSession()
            .then(s => {
                this.todos = this.sqliteService.arr;
                this.text = '';
            });
    }

    //Deleting function
    delete(i) {
        this
            .sqliteService
            .del(i)
            .then(s => {
                this.todos = this.sqliteService.arr;
            });
    }

    //updating function
    update(id, todo) {
        var prompt = window.prompt('Update', todo);
        this
            .sqliteService
            .update(id, prompt)
            .then(s => {
                this.todos = this.sqliteService.arr;
            });
    }

    ionViewDidLoad() {

    }

    reloadSessions(refresher = null) {
        this
            .sqliteService
            .getSessions()
            .then(s => {
                this.todos = this.sqliteService.arr;
                if (refresher != null)
                    refresher.complete();
            });
    }

    loadSession(sessionId) {
        let mapLoadModal = this.modalCtrl.create(ModalLoadSession, {sessionId: sessionId});
        mapLoadModal.present();
    }
}


@Component({
    selector: 'page-home',
    templateUrl: 'modalLoadedSession.html'
})


export class ModalLoadSession {

    @ViewChild('mapLoaded') mapElement:ElementRef;
    mapLoaded:any;

    sessionId;
    sessionDetails = [];

    constructor(public platform:Platform, public params:NavParams, public viewCtrl:ViewController, public sqliteService:Sqlite, public globalVars:GlobalVars) {
        this.sessionId = this.params.get('sessionId');
        this
            .sqliteService
            .getSessionDetail(this.sessionId)
            .then(s => {
                this.sessionDetails = this.sqliteService.arrSessionDetail;
                for (var i = 0; i < this.sessionDetails.length; i++) {
                    this.addMarker(this.sessionDetails[i]);
                    if (i == 0) {
                        // alert(JSON.stringify(this.sessionDetails[i]));
                        let latLng = new google.maps.LatLng(this.sessionDetails[i].session_detail_coord_lat, this.sessionDetails[i].session_detail_coord_long);

                        let mapOptions = {
                            center: latLng,
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        this.mapLoaded = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
                    }
                    alert(JSON.stringify(this.sessionDetails[i]));
                }
            });

    }


    addMarker(position) {

        let marker = new google.maps.Marker({
            map: this.mapLoaded,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(position.session_detail_coord_lat, position.session_detail_coord_long)
        });

    //    let content = "<h4>Vitesse : " + position.session_detail_coord_speed.toFixed(2) + "Km/h </h4>";

      //  this.addInfoWindow(marker, content);

    }

    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.mapLoaded, marker);
        });

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}