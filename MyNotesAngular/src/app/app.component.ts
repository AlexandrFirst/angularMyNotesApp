import { Component, OnInit } from '@angular/core';
import { SignalRService } from './Services/SignalR.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MyNotes';

  /**
   *
   */
  constructor(private messageService: SignalRService) {
    
  }
  ngOnInit(): void {
    this.messageService.connectToHub();
  }
}
