import { Component, OnInit, HostBinding, ViewChild, ComponentFactory, AfterViewInit } from '@angular/core';
import { PromptContainerDirective } from './prompt-container.directive';
import { PromptInjectorService } from '../../infrastructure/prompt-injector.service';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit, AfterViewInit {

  @HostBinding('class') cls = "smooth";
  @HostBinding('class.toggled') toggled = false;
  @ViewChild(PromptContainerDirective) appPromptContainer: PromptContainerDirective;

  constructor(
    private prompt: PromptInjectorService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.prompt.init(this.appPromptContainer.viewContainerRef);
    this.prompt.componentChange.subscribe(prompt => {
      prompt.toClose.subscribe(() => {
        this.hide();
      });
      this.show();
    });
  }

  show() {
    this.toggled = true;
  }

  hide() {
    this.toggled = false;
  }
}
