import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LoadingSignService } from './loading-sign.service';

@Component({
  selector: 'loading-sign',
  templateUrl: './loading-sign.component.html',
  styleUrls: ['./loading-sign.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ opacity: '0' }),
        animate('0.1s')
      ]),
      transition('* => void', [
        animate('0.1s', style({ opacity: '1' }))
      ])
    ])
  ]
})
export class LoadingSignComponent implements OnInit {

  constructor(private loadingService: LoadingSignService) { }

  isActivated: boolean = false;

  ngOnInit(): void {
    this.loadingService.activateLoadSignStream.subscribe(next => {
      this.isActivated = next as boolean;
    });
  }




}
