import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { BranchListComponent } from './branch-list.component';
import { BranchItemComponent } from '../branch-item/branch-item.component';
import { D3Service } from '../d3/d3.service';
import { MockD3 } from '../mocks/mock-d3-service';
import { ContextMenuModule } from 'ngx-contextmenu';
import { OnInit, Component } from '../../../../node_modules/@angular/core';

describe('BranchListComponent', () => {
  let component: BranchListComponent;
  let fixture: ComponentFixture<BranchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchListComponent, BranchItemComponent, HostComponent ],
      imports: [
        ContextMenuModule
      ],
      providers: [
        {provide: D3Service, useClass: MockD3}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should not error out if no branches on mapChange', fakeAsync(() => {
    let fixtureLocal = TestBed.createComponent(HostComponent);
    let compLocal = fixture.componentInstance;
    fixtureLocal.detectChanges();
    let d3 = TestBed.get(D3Service) as MockD3;

    d3.mapChange.emit();
    tick(1);
    fixtureLocal.detectChanges();

    expect(compLocal).toBeTruthy();
  }));
});

@Component({
  selector: 'app-host',
  template: `<app-branch-list [branches]="input"></app-branch-list>`
})
class HostComponent implements OnInit {
  private input = undefined;

  ngOnInit(): void {
  }
}
