import { Component, OnInit } from '@angular/core';
import { Dish } from './core/script.js';
import { add, less } from './controls/script.js';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss',
    './controls/styles.css',
    './core/styles.css']
})
export class VideochatComponent implements OnInit {

  constructor() { }

  ngOnInit() {


    let Body = document.body;
    let Add = document.createElement('div');
    Add.className = 'more';
    Add.addEventListener("click", function (event) {
      add();
    });

    let Less = document.createElement('div');
    Less.className = 'less';
    Less.addEventListener("click", function (event) {
      less();
    });


    Body.appendChild(Add);
    Body.appendChild(Less);




    Dish();
    window.onresize = Dish;

  }

}
