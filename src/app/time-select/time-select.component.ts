import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ns-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.scss'],
})
export class TimeSelectComponent implements OnInit {
  public username: string;
  private pushToken: string;

  public readonly timeControl = new FormControl(new Date());

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
    this.pushToken = this.route.snapshot.queryParams.pushToken;
  }
}
