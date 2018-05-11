import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../models/profile';

@Component({
  selector: 'app-profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {

  @Input() profile: Profile;
  constructor() { }

  ngOnInit() {
  }

}
