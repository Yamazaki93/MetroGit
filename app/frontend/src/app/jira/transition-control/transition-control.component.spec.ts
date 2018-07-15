import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionControlComponent } from './transition-control.component';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { MockJira } from '../../core/mocks/mock-jira-service';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { MockPromptInjector } from '../../infrastructure/mocks/mock-prompt-injector-service';
import { OnInit, Component } from '../../../../node_modules/@angular/core';
import { Status } from '../models/status';

describe('TransitionControlComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, TransitionControlComponent],
      providers: [
        { provide: JiraIntegrationService, useClass: MockJira },
        { provide: PromptInjectorService, useClass: MockPromptInjector }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-host',
  template: `<app-transition-control [status]="input"></app-transition-control>`
})
class HostComponent implements OnInit {
  private input: Status;
  ngOnInit(): void {
    this.input = {
      name: "Done",
      statusCategory: {
        key: "done",
        colorName: "green",
        name: "Done",
      }
    };
  }
}
