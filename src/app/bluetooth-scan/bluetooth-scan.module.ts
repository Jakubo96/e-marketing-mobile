import { NgModule } from '@angular/core';
import { BluetoothScanComponent } from 'app/bluetooth-scan/bluetooth-scan.component';
import { BluetoothScanRoutingModule } from 'app/bluetooth-scan/bluetooth-scan-routing.module';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

@NgModule({
  declarations: [BluetoothScanComponent],
  imports: [
    NativeScriptCommonModule,
    BluetoothScanRoutingModule,
    NativeScriptUIListViewModule,
  ],
})
export class BluetoothScanModule {}
