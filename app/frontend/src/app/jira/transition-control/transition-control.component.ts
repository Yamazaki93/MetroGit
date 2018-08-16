import { Component, OnInit, Input, EventEmitter, Output, HostBinding, ElementRef, HostListener } from '@angular/core';
import { Status } from '../models/status';
import { Transition } from '../models/transition';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { ResolutionSelectorComponent } from '../resolution-selector/resolution-selector.component';

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
    private prompt: PromptInjectorService,
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
    let selectResolution = false;
    this.transitions.forEach(t => {
      if (t.id === transitionID && t.to.statusCategory.key === 'done') {
        if (t.fields.resolution) {
          let pmpt = this.prompt.injectComponent(ResolutionSelectorComponent);
          pmpt.required = t.fields.resolution.required;
          pmpt.key = this.key;
          selectResolution = true;
          pmpt.toEnter.subscribe(resolution => {
            this.transitioning.emit();
            if (resolution) {
              this.jira.updateIssue(this.key, { "resolution": { "id": resolution } }, { "id": transitionID });
            } else {
              this.jira.updateIssue(this.key, null, { "id": transitionID });
            }
          });
        }
      }
    });
    if (!selectResolution) {
      this.transitioning.emit();
      this.jira.updateIssue(this.key, null, { "id": transitionID });
    }
  }

}
