import { Component, OnInit, Input, EventEmitter, Output, HostBinding, ElementRef, HostListener } from '@angular/core';
import { Status } from '../models/status';
import { Transition } from '../models/transition';
import { JiraIntegrationService } from '../services/jira-integration.service';

@Component({
  selector: 'app-transition-control',
  templateUrl: './transition-control.component.html',
  styleUrls: ['./transition-control.component.scss']
})
export class TransitionControlComponent implements OnInit {

  @Input() key: string;
  @Input() padding: number;
  @Input() status: Status;
  @Input() transitions: Transition[];
  @Output() transitioning: EventEmitter<{}> = new EventEmitter();
  @HostListener('document:click') click = this.onClick;
  private toggled = false;
  constructor(
    private jira: JiraIntegrationService,
    private eref: ElementRef,
  ) {
  }

  ngOnInit() {
  }

  onClick($event) {
    if (!this.eref.nativeElement.contains(event.target)) {
      this.toggled = false;
    }
  }

  doTransition(transitionID) {
    this.transitioning.emit();
    this.jira.updateIssue(this.key, null, {"id": transitionID});
  }

}
