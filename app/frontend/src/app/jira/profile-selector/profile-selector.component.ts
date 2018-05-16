import { Component, OnInit, Input, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { Profile } from '../models/profile';
import { JiraIntegrationService } from '../services/jira-integration.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {

  @Input() profile: Profile;
  @Input() key: string;
  @HostListener('document:click') click = this.onClick;
  @Output() profileSelected = new EventEmitter();
  private toggled = false;
  private loading = false;
  private users: Profile[] = [];
  private searchName = "";
  constructor(
    private jira: JiraIntegrationService,
    private eref: ElementRef,
    private sanitizer: DomSanitizer,
  ) {
    jira.assignableRetrieved.subscribe(data => {
      if (data.key === this.key) {
        this.users = data.result;
        this.users.forEach(user => {
          user.safeAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(user.avatarUrls['32x32']);
        });
        this.loading = false;
      }
    });
  }

  ngOnInit() {
  }

  onClick($event) {
    if (!this.eref.nativeElement.contains(event.target)) {
      this.toggled = false;
    }
  }
  toggleSelection() {
    this.toggled = !this.toggled;
    if (this.toggled && this.key) {
      this.loading = true;
      this.users = [];
      this.jira.findAssignableUsers(this.key, this.searchName);
    }
  }
  onInputClick($event) {
    $event.stopPropagation();
  }
  onSearchChanged() {
    this.loading = true;
    this.jira.findAssignableUsers(this.key, this.searchName);
  }
  onSelectProfile(name) {
    this.profileSelected.emit();
    this.jira.assignIssue(this.key, name);
  }
}
