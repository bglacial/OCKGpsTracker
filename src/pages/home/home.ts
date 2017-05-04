import { Component } from '@angular/core';
import { NavController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { MapActionPage } from '../mapaction/mapaction';

declare var window: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    tabMapActionRoot = MapActionPage;

    constructor(public navCtrl:NavController, public modalCtrl:ModalController ) {

    }

    ionViewDidLoad() {
    }

    openModal(smsContenu) {
        let modal = this.modalCtrl.create(ModalContentPage, smsContenu);
        modal.present();
        setTimeout(function(){ modal.dismiss(); }, 3000);
    }
}

@Component({
    selector: 'page-home',
    templateUrl: 'modalSMS.html'
})
export class ModalContentPage {
    smsContent;

    constructor(public platform:Platform, public params:NavParams, public viewCtrl:ViewController) {

        this.smsContent = this.params.get('smsContenu');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}