import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage, ModalLoadSession } from '../pages/home/home';
import { MapActionPage } from '../pages/mapaction/mapaction';
import { MapLoadPage } from '../pages/mapload/mapload';
import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen'
import {Sqlite} from '../providers/sqlite'
import {GlobalVars} from '../providers/globalvars';

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        HomePage,
        ModalLoadSession,
        TabsPage,
        MapActionPage,
        MapLoadPage,
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        BrowserModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        ModalLoadSession,
        TabsPage,
        MapActionPage,
        MapLoadPage,
    ],
    providers: [
        BackgroundGeolocation,
        Geolocation,
        StatusBar,
        GlobalVars,
        Sqlite,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}