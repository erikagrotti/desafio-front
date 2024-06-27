import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskListComponent } from './create-task-list.component';

describe('CreateTaskListComponent', () => {
  let component: CreateTaskListComponent;
  let fixture: ComponentFixture<CreateTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaskListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
