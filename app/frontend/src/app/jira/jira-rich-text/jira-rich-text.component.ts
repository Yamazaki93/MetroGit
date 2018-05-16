import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-jira-rich-text',
  templateUrl: './jira-rich-text.component.html',
  styleUrls: ['./jira-rich-text.component.scss']
})
export class JiraRichTextComponent implements OnInit, AfterViewChecked {

  @Input() set rawText(raw: string) {
    this.richText = this.sanitizer.bypassSecurityTrustHtml(raw);
  }
  @ViewChild('container') container: ElementRef;

  private richText: SafeHtml;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }
  ngAfterViewChecked(): void {
    let eles = this.container.nativeElement.getElementsByTagName('a');
    if (eles && eles.length) {
      for (let i = 0; i < eles.length; i++) {
        eles[i].setAttribute('href', 'javascript:void(0)');
      }
    }
  }

}
