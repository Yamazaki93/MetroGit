import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-jira-rich-text',
  templateUrl: './jira-rich-text.component.html',
  styleUrls: ['./jira-rich-text.component.scss']
})
export class JiraRichTextComponent implements OnInit {

  @Input() set rawText(raw: string) {
    this.richText = this.sanitizer.bypassSecurityTrustHtml(raw);
  }

  private richText: SafeHtml;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

}
