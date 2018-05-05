import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icheck',
  templateUrl: './icheck.component.html',
  styleUrls: ['./icheck.component.scss']
})
export class IcheckComponent implements OnInit {

  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  @Input()
  set checked(value) {
    this.checkedValue = value;
  }
  get checked() {
    return this.checkedValue;
  }
  private checkedValue = false;
  constructor() { }

  ngOnInit() {
  }

  onClick() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checkedValue);
    }
  }
}
