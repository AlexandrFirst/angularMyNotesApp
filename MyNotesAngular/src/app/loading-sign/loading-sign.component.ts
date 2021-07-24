import { Component, OnInit } from '@angular/core';
import { LoadingSignService } from './loading-sign.service';

@Component({
  selector: 'loading-sign',
  templateUrl: './loading-sign.component.html',
  styleUrls: ['./loading-sign.component.scss']
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
