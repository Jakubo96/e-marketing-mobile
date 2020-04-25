import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { isAndroid, Page } from 'tns-core-modules/ui/page';
import { Bluetooth } from 'nativescript-bluetooth';
import * as applicationModule from 'tns-core-modules/application';
import { requestPermission } from 'nativescript-permissions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import BluetoothDevice = android.bluetooth.BluetoothDevice;
import BluetoothAdapter = android.bluetooth.BluetoothAdapter;
import IntentFilter = android.content.IntentFilter;
import Intent = android.content.Intent;
import BroadcastReceiver = android.content.BroadcastReceiver;
import Context = android.content.Context;
import Parcelable = android.os.Parcelable;

@AutoUnsubscribe()
@Component({
  selector: 'ns-bluetooth-test',
  templateUrl: './bluetooth-test.component.html',
  styleUrls: ['./bluetooth-test.component.scss'],
})
export class BluetoothTestComponent implements OnInit, OnDestroy {
  @ViewChild('listView', { static: false }) public listView: ElementRef;

  private readonly bluetooth = new Bluetooth();
  private readonly receiver = new CustomReceiver();
  public readonly detectedDevices: string[] = [];

  public scanning = false;

  constructor(private readonly page: Page) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    this.scanBluetooth();
  }

  public ngOnDestroy(): void {
    applicationModule.android.foregroundActivity.unregisterReceiver(
      this.receiver
    );
  }

  private async scanBluetooth(): Promise<void> {
    const enabled = await this.providePermissions();

    if (enabled) {
      if (isAndroid) {
        this.discoverDevices();
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('Bluetooth not enabled');
    }
  }

  private async providePermissions(): Promise<boolean> {
    let permissionGranted: boolean;
    try {
      await requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION);
      permissionGranted = true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('ACCESS_FINE_LOCATION permission not granted');
      permissionGranted = false;
    }
    return (await this.bluetooth.enable()) && permissionGranted;
  }

  private discoverDevices(): void {
    this.setupReceivers();

    const btAdapter = BluetoothAdapter.getDefaultAdapter();
    btAdapter.startDiscovery();
  }

  private setupReceivers(): void {
    this.registerReceivers();
    this.handleReceivers();
  }

  private registerReceivers(): void {
    applicationModule.android.foregroundActivity.registerReceiver(
      this.receiver,
      new IntentFilter(BluetoothDevice.ACTION_FOUND)
    );

    applicationModule.android.foregroundActivity.registerReceiver(
      this.receiver,
      new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_STARTED)
    );

    applicationModule.android.foregroundActivity.registerReceiver(
      this.receiver,
      new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
    );
  }

  private handleReceivers(): void {
    this.receiver.deviceDetected.subscribe((device: Parcelable) => {
      // eslint-disable-next-line no-console
      console.log(`Detected: ${device}`);
      this.detectedDevices.push(device);
      this.listView.nativeElement.refresh();
    });
    this.receiver.discoveryStarted.subscribe(() => (this.scanning = true));
    this.receiver.discoveryFinished.subscribe(() => (this.scanning = false));
  }
}

class CustomReceiver extends BroadcastReceiver {
  public deviceDetected = new EventEmitter<Parcelable>();
  public discoveryStarted = new EventEmitter();
  public discoveryFinished = new EventEmitter();

  public onReceive(context: Context, intent: Intent): void {
    switch (intent.getAction()) {
      case BluetoothDevice.ACTION_FOUND:
        const device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
        this.deviceDetected.emit(device);
        break;
      case BluetoothAdapter.ACTION_DISCOVERY_STARTED:
        this.discoveryStarted.emit();
        break;
      case BluetoothAdapter.ACTION_DISCOVERY_FINISHED:
        this.discoveryFinished.emit();
        break;
    }
  }
}
