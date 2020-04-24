import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluetoothTestComponent } from 'app/bluetooth-test/bluetooth-test.component';
import { BluetoothTestRoutingModule } from 'app/bluetooth-test/bluetooth-test-routing.module';

@NgModule({
  declarations: [BluetoothTestComponent],
  imports: [CommonModule, BluetoothTestRoutingModule],
})
export class BluetoothTestModule {}
