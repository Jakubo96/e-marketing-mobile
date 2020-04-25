import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluetoothScanComponent } from 'app/bluetooth-scan/bluetooth-scan.component';
import { BluetoothScanRoutingModule } from 'app/bluetooth-scan/bluetooth-scan-routing.module';

@NgModule({
  declarations: [BluetoothScanComponent],
  imports: [CommonModule, BluetoothScanRoutingModule],
})
export class BluetoothScanModule {}
