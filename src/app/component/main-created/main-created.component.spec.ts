import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCreatedComponent } from './main-created.component';

describe('MainCreatedComponent', () => {
  let component: MainCreatedComponent;
  let fixture: ComponentFixture<MainCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCreatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
