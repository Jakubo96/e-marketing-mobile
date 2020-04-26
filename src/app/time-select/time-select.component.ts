import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.css'],
})
export class TimeSelectComponent implements OnInit {
  public username: string;
  private mac: string;

  constructor(
    page: Page,
    private readonly route: ActivatedRoute,
    private readonly router: RouterExtensions
  ) {
    page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    this.retrieveUsernameAndMac();
  }

  private retrieveUsernameAndMac(): void {
    this.username = this.route.snapshot.queryParams.username;
    this.mac = this.route.snapshot.queryParams.mac;

    console.log(this.username);
    console.log(this.mac);
  }
}
