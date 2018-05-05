import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'app-prompt-container'
})
export class PromptContainerDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
