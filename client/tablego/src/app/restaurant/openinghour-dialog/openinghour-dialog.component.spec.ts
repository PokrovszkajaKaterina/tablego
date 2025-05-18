import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeninghourDialogComponent } from './openinghour-dialog.component';

describe('OpeninghourDialogComponent', () => {
  let component: OpeninghourDialogComponent;
  let fixture: ComponentFixture<OpeninghourDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeninghourDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpeninghourDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
