import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchListComponent } from './branch-list.component';
import { BranchItemComponent } from '../branch-item/branch-item.component';
import { D3Service } from '../d3/d3.service';
import { MockD3 } from '../mocks/mock-d3-service';
import { ContextMenuModule } from 'ngx-contextmenu';

describe('BranchListComponent', () => {
  let component: BranchListComponent;
  let fixture: ComponentFixture<BranchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchListComponent, BranchItemComponent ],
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
});
