import { Component, OnInit, OnChanges, Input, ChangeDetectorRef } from '@angular/core';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit, OnChanges {

  // tslint:disable-next-line:no-input-rename
  @Input('status') data;
  coinName = 'VIG Coin';
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.data && this.data.config.coin) {
      this.cdr.detectChanges();
      // this.coinName = this.data.config.coin;
      const updates = $('#stats_updated');
      updates.css('transition', 'opacity 100ms ease-out');
      updates.css('opacity', 1);
      setTimeout(function () {
        updates.css('transition', 'opacity 7000ms linear');
        updates.css('opacity', 0);
      }, 500);

    }
  }

}
