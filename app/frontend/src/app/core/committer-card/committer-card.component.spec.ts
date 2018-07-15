import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitterCardComponent } from './committer-card.component';
import { D3Service } from '../d3/d3.service';
import { MockD3 } from '../mocks/mock-d3-service';

describe('CommitterCardComponent', () => {
  let component: CommitterCardComponent;
  let fixture: ComponentFixture<CommitterCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommitterCardComponent],
      providers: [
        { provide: D3Service, useClass: MockD3 }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
