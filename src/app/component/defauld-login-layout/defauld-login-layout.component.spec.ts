import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefauldLoginLayoutComponent } from './defauld-login-layout.component';

describe('DefauldLoginLayoutComponent', () => {
  let component: DefauldLoginLayoutComponent;
  let fixture: ComponentFixture<DefauldLoginLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefauldLoginLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefauldLoginLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
