import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { isAndroid } from 'tns-core-modules/platform';
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

@AutoUnsubscribe()
@Component({
  selector: 'ns-bluetooth-scan',
  templateUrl: './bluetooth-scan.component.html',
  styleUrls: ['./bluetooth-scan.component.scss'],
})
export class BluetoothScanComponent implements OnInit, OnDestroy {
  @ViewChild('listView', { static: false }) public listView: ElementRef;

  private readonly bluetooth = new Bluetooth();
  private readonly btAdapter = BluetoothAdapter.getDefaultAdapter();
  private readonly receiver = new CustomReceiver();
  public readonly detectedDevices: string[] = [];

  public scanning = false;

  constructor(private readonly page: Page, private readonly zone: NgZone) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    this.scanBluetooth();
  }

  public ngOnDestroy(): void {
    if (this.scanning) {
      this.btAdapter.cancelDiscovery();
    }
    applicationModule.android.foregroundActivity.unregisterReceiver(
      this.receiver
    );
  }

  public restartScan(): void {
    if (!this.scanning) {
      this.detectedDevices.length = 0;
      this.listView.nativeElement.refresh();
      this.btAdapter.startDiscovery();
    }
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

    this.btAdapter.startDiscovery();
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
    this.receiver.deviceDetected.subscribe((device: string) => {
      this.detectedDevices.push(device);
      this.listView.nativeElement.refresh();
    });
    this.receiver.discoveryStarted.subscribe(() => {
      this.zone.run(() => (this.scanning = true));
    });
    this.receiver.discoveryFinished.subscribe(() => {
      this.zone.run(() => (this.scanning = false));
    });
  }
}

class CustomReceiver extends BroadcastReceiver {
  public deviceDetected = new EventEmitter<string>();
  public discoveryStarted = new EventEmitter();
  public discoveryFinished = new EventEmitter();

  public onReceive(context: Context, intent: Intent): void {
    switch (intent.getAction()) {
      case BluetoothDevice.ACTION_FOUND:
        const device = intent
          .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
          .toString();
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
