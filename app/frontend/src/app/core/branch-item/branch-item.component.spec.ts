import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchItemComponent } from './branch-item.component';
import { D3Service } from '../d3/d3.service';
import { ElectronService } from '../../infrastructure/electron.service';
import { MockElectron } from '../../infrastructure/mocks/mock-electron.service';

class MockD3 {
  scrollTo(commit) {
  }
}

describe('BranchItemComponent', () => {
  let component: BranchItemComponent;
  let fixture: ComponentFixture<BranchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchItemComponent ],
      providers: [
        {provide: ElectronService, useClass: MockElectron},
        {provide: D3Service, useClass: MockD3 }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchItemComponent);
    component = fixture.componentInstance;
    component.item = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
