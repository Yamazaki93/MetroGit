import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeVisualComponent } from './node-visual.component';
import { MockCommitSelection } from '../../../mocks/mock-commit-selection-service';
import { CommitSelectionService } from '../../../services/commit-selection.service';
import { CommitChangeService } from '../../../services/commit-change.service';
import { MockCommitChange } from '../../../mocks/mock-commit-change-service';
import { NO_ERRORS_SCHEMA, Component, OnInit } from '../../../../../../node_modules/@angular/core';
import { ContextMenuModule, ContextMenuService } from '../../../../../../node_modules/ngx-contextmenu';
import { MockContextMenuService } from '../../../mocks/mock-context-menu-service';
import { Node } from '../../../d3/models/node';
import { Color } from '../../../d3/models/color';

describe('NodeVisualComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ContextMenuModule
      ],
      declarations: [ HostComponent, NodeVisualComponent ],
      providers: [
        {provide: CommitSelectionService, useClass: MockCommitSelection},
        {provide: CommitChangeService, useClass: MockCommitChange},
        {provide: ContextMenuService, useClass: MockContextMenuService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-host',
  template: `<node-visual [nodeVisual]="input"></node-visual>`
})
class HostComponent implements OnInit {
  private input: Node;
  ngOnInit(): void {
    let n1 = new Node("1");
    n1.x = 0;
    n1.y = 0;
    n1.commit = {
      sha: "",
      author: "",
      email: "",
      parents: [""],
      message: "",
      date: new Date(),
      ci: "",
      virtual: false,
      isStash: false,
      stashIndex: 0
    };
    this.input = n1;
    this.input.color = new Color(0, 0, 0);
  }
}
