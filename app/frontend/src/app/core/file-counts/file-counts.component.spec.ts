import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCountsComponent } from './file-counts.component';
import { LayoutService } from '../services/layout.service';
import { MockLayout } from '../mocks/mock-layout-service';
import { NgbModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

describe('FileCountsComponent', () => {
  let component: FileCountsComponent;
  let fixture: ComponentFixture<FileCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileCountsComponent ],
      imports: [
        NgbModule.forRoot(),
      ],
      providers: [
        {provide: LayoutService, useClass: MockLayout}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
