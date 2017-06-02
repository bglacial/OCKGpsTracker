import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Sessions } from './sessions';

@NgModule({
  declarations: [
    Sessions,
  ],
  imports: [
    IonicPageModule.forChild(Sessions),
  ],
  exports: [
    Sessions
  ]
})
export class SessionsModule {}
