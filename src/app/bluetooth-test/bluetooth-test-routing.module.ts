import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { BluetoothTestComponent } from 'app/bluetooth-test/bluetooth-test.component';

const routes: Routes = [{ path: '', component: BluetoothTestComponent }];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class BluetoothTestRoutingModule {}
