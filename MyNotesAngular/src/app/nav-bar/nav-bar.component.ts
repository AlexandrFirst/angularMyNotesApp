import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor() { }

  isSidebarActive = false;

  toggleSidebar(){
    this.isSidebarActive = !this.isSidebarActive;
  }

  ngOnInit(): void {
  }

}
