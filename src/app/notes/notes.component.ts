import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {


  isSidebarActive = false;

  toggleSidebar(){
    this.isSidebarActive = !this.isSidebarActive;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
