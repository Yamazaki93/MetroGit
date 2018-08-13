import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Resolution } from '../models/resolution';
import { JiraIntegrationService } from '../services/jira-integration.service';

@Component({
  selector: 'app-resolution-control',
  templateUrl: './resolution-control.component.html',
  styleUrls: ['./resolution-control.component.scss']
})
export class ResolutionControlComponent implements OnInit {

  @Input() resolution: Resolution;
  @Input() key: string;
  @Input() editable = true;
  @Output() resolutionSelected: EventEmitter<Resolution> = new EventEmitter<Resolution>();
  private resolutions: Resolution[];
  private toggled = false;
  constructor(
    private jira: JiraIntegrationService
  ) {
    this.resolutions = this.jira.resolutions;
  }

  ngOnInit() {
  }

  selectResolution(resolution: Resolution) {
    this.jira.updateIssue(this.key, { "resolution": { "name": resolution.name } });
    this.resolutionSelected.emit(resolution);
  }
  toggle() {
    if (this.editable) {
      this.toggled = !this.toggled;
    }
  }
}
