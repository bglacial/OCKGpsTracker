import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';

/**
 * Generated class for the About page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class About {

  constructor(public navCtrl: NavController, public navParams: NavParams, public locationTracker: LocationTracker) {
  }

    ionViewDidLoad() {
    console.log('ionViewDidLoad About');
    }

    start(){
        this.locationTracker.startTracking();
    }

    stop(){
        this.locationTracker.stopTracking();
    }

}
