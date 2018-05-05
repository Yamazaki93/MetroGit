import { Component, OnInit, Input } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ci-console-output',
  templateUrl: './ci-console-output.component.html',
  styleUrls: ['./ci-console-output.component.scss']
})
export class CiConsoleOutputComponent implements OnInit {

  @Input() loading = false;
  @Input() set text(txt: string) {
    let temp = txt;
    temp = temp.replace(/\n/g, '<br/>');
    this.display = this.sanitizer.bypassSecurityTrustHtml(temp);
  }
  private display: SafeHtml;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

}
