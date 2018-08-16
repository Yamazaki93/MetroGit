import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionControlComponent } from './resolution-control.component';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { MockJira } from '../../core/mocks/mock-jira-service';
import { Component, OnInit, ViewChild } from '../../../../node_modules/@angular/core';
import { Resolution } from '../models/resolution';
import { ResolutionSelectorComponent } from '../resolution-selector/resolution-selector.component';

describe('ResolutionControlComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResolutionControlComponent, HostComponent],
      providers: [
        { provide: JiraIntegrationService, useClass: MockJira }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    let jira = TestBed.get(JiraIntegrationService) as MockJira;
    jira.resolutions = [{
      name: "Done",
      self: 'test',
      description: 'done',
      iconUrl: '',
    }];
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have resolutions from jira service on init', () => {
    expect(fixture.nativeElement.querySelectorAll('.transition').length).toBe(1);
  });
  it('should emit resolutionSelected on clicking resolution', () => {
    fixture.nativeElement.querySelectorAll('.transition')[0].click();

    expect(component.output.name).toBe('Done');
  });
  it('should delegate to JIRAService updateIssue when selecting resolution', () => {
    let jira = TestBed.get(JiraIntegrationService) as MockJira;
    let spy = spyOn(jira, 'updateIssue').and.callThrough();

    fixture.nativeElement.querySelectorAll('.transition')[0].click();

    expect(spy).toHaveBeenCalled();
  });
});

@Component({
  selector: 'app-host',
  template: `<app-resolution-control #ctrl [key]="key" [resolution]="input" (resolutionSelected)="select(res)"></app-resolution-control>`
})
class HostComponent implements OnInit {
  private input: Resolution;
  private key = "";
  output: Resolution;
  @ViewChild('ctrl') ctrl: ResolutionControlComponent;
  ngOnInit(): void {
    this.input = {
      name: "Done",
      self: 'test',
      description: 'done',
      iconUrl: '',
    };
    this.ctrl.resolutionSelected.subscribe(s => {
      this.output = s;
    });
  }

}
