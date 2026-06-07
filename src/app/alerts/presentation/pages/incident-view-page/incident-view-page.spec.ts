import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IncidentViewPage } from './incident-view-page';

describe('IncidentViewPage', () => {
  let component: IncidentViewPage;
  let fixture: ComponentFixture<IncidentViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentViewPage, MatDialogModule, NoopAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IncidentViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});