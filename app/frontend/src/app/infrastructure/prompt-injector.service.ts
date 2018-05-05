import { Injectable, ComponentFactoryResolver, ViewContainerRef, Type, Output, EventEmitter } from '@angular/core';
import { Prompt } from './prompt';

@Injectable()
export class PromptInjectorService {

  @Output() componentChange = new EventEmitter<Prompt>();
  private vcf: ViewContainerRef;
  constructor(
    private cfr: ComponentFactoryResolver
  ) { }

  init(vcf: ViewContainerRef) {
    this.vcf = vcf;
  }

  injectComponent<T extends Prompt>(component: Type<T>): T {
    this.vcf.clear();
    let cf = this.cfr.resolveComponentFactory(component);
    let componentRef = this.vcf.createComponent(cf);
    this.componentChange.emit(<Prompt>componentRef.instance);
    return componentRef.instance;
  }
}
