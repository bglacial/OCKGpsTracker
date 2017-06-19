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
    poly:any;

    trajectoire = [];
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
                    let latLng = new google.maps.LatLng(this.sessionDetails[i].session_detail_coord_lat, this.sessionDetails[i].session_detail_coord_long);
                    if (i == 0) {
                        let mapOptions = {
                            center: latLng,
                            disableDefaultUI: true,
                            zoom: 17,
                            mapTypeId: google.maps.MapTypeId.SATELLITE
                        };

                        this.mapLoaded = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
                        this.poly = new google.maps.Polyline({
                            strokeColor: '#000000',
                            strokeOpacity: 1.0,
                            strokeWeight: 5
                        });
                        this.poly.setMap(this.mapLoaded);
                    }
                    var path = this.poly.getPath();
                    path.push(latLng);

                    // Because path is an MVCArray, we can simply append a new coordinate
                    // and it will automatically appear.
                    this.trajectoire.push(latLng);
                }

            });

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}