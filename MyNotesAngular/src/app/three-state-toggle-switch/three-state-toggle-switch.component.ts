import { Component, forwardRef, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-three-state-toggle-switch',
  templateUrl: './three-state-toggle-switch.component.html',
  styleUrls: ['./three-state-toggle-switch.component.scss'],
})
export class ThreeStateToggleSwitchComponent implements OnInit {

  private isSubscribers: boolean | null;

  @Output() value = new EventEmitter<boolean | null>();

  constructor() { }

  ngOnInit(): void {
    $('.toggle input').on('change', () => {
      this.isSubscribers = JSON.parse($('input[name="toggle"]:checked', '.toggle').val().toString().toLowerCase());
      this.value.emit(this.isSubscribers);
    });
  }
}
