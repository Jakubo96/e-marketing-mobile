import { Component } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'ns-view-select',
  templateUrl: './view-select.component.html',
  styleUrls: ['./view-select.component.scss'],
})
export class ViewSelectComponent {
  constructor(private readonly page: Page) {
    this.page.actionBarHidden = true;
  }
}
