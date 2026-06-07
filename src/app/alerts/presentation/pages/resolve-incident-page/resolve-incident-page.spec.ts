import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResolveIncidentPage } from './resolve-incident-page';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResolveIncidentPage', () => {
  let component: ResolveIncidentPage;
  let fixture: ComponentFixture<ResolveIncidentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveIncidentPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ResolveIncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty resolution note', () => {
    expect(component.resolutionNote()).toBe('');
  });

  it('should default resolution type to manual', () => {
    expect(component.resolutionType()).toBe('manual');
  });

  it('should not allow confirm when note is empty', () => {
    expect(component.canConfirm).toBeFalse();
  });

  it('should allow confirm when note has content', () => {
    component.onNoteChange('Temperature normalized after adjusting thermostat.');
    expect(component.canConfirm).toBeTrue();
  });

  it('should not exceed MAX_CHARS limit', () => {
    const longText = 'a'.repeat(600);
    component.onNoteChange(longText);
    expect(component.resolutionNote().length).toBeLessThanOrEqual(component.MAX_CHARS);
  });

  it('should toggle follow-up flag', () => {
    expect(component.scheduleFollowUp()).toBeFalse();
    component.toggleFollowUp();
    expect(component.scheduleFollowUp()).toBeTrue();
  });

  it('should set resolution type correctly', () => {
    component.setResolutionType('escalated');
    expect(component.resolutionType()).toBe('escalated');
  });

  it('should remove photo on removePhoto()', () => {
    component['uploadedFileName'].set('test.jpg');
    component['uploadedFilePreview'].set('data:image/jpeg;base64,abc');
    component.removePhoto();
    expect(component.uploadedFileName()).toBeNull();
    expect(component.uploadedFilePreview()).toBeNull();
  });
});
