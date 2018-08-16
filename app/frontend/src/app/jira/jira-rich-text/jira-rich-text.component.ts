import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JiraIntegrationService } from '../services/jira-integration.service';

@Component({
  selector: 'app-jira-rich-text',
  templateUrl: './jira-rich-text.component.html',
  styleUrls: ['./jira-rich-text.component.scss']
})
export class JiraRichTextComponent implements OnInit, AfterViewChecked {

  @Input() key = "";
  @Input() set rawText(raw: string) {
    this.richText = this.sanitizer.bypassSecurityTrustHtml(raw);
  }
  @ViewChild('container') container: ElementRef;

  private richText: SafeHtml;
  constructor(
    private jira: JiraIntegrationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }
  ngAfterViewChecked(): void {
    let eles = this.container.nativeElement.getElementsByTagName('a');
    if (eles && eles.length) {
      for (let i = 0; i < eles.length; i++) {
        if (eles[i].classList.contains('jira-issue-macro-key') && eles[i].getAttribute('href').indexOf(`https://${this.jira.jiraUrl}/browse`) !== -1) {
          let url = eles[i].getAttribute('href');
          url = url.replace(`https://${this.jira.jiraUrl}/browse/`, '#jira-issue/');
          url += '/' + this.key;
          eles[i].setAttribute('href', url);
        }
      }
    }
  }

}
