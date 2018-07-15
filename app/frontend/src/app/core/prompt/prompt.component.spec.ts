import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptComponent } from './prompt.component';
import { NO_ERRORS_SCHEMA } from '../../../../node_modules/@angular/core';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';
import { MockPromptInjector } from '../../infrastructure/mocks/mock-prompt-injector-service';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { PromptContainerDirective } from './prompt-container.directive';

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptComponent, PromptContainerDirective ],
      providers: [
        {provide: PromptInjectorService, useClass: MockPromptInjector}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
