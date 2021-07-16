import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnaliticComponent } from './admin-analitic.component';

describe('AdminAnaliticComponent', () => {
  let component: AdminAnaliticComponent;
  let fixture: ComponentFixture<AdminAnaliticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAnaliticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAnaliticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
