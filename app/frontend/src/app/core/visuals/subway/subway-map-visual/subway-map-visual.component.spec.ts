import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubwayMapVisualComponent } from './subway-map-visual.component';
import { D3Service } from '../../../d3/d3.service';
import { CiIntegrationService } from '../../../services/ci-integration.service';
import { MockD3 } from '../../../mocks/mock-d3-service';
import { MockCIIntegration } from '../../../mocks/mock-ci-integration-service';
import { LinkVisualComponent } from '../../shared/link-visual/link-visual.component';
import { NodeVisualComponent } from '../../shared/node-visual/node-visual.component';
import { ContextMenuModule } from '../../../../../../node_modules/ngx-contextmenu';

describe('SubwayMapVisualComponent', () => {
  let component: SubwayMapVisualComponent;
  let fixture: ComponentFixture<SubwayMapVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ContextMenuModule
      ],
      declarations: [ SubwayMapVisualComponent, LinkVisualComponent, NodeVisualComponent ],
      providers: [
        {provide: D3Service, useClass: MockD3},
        {provide: CiIntegrationService, useClass: MockCIIntegration}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubwayMapVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
