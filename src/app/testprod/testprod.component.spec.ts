import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestprodComponent } from './testprod.component';

describe('TestprodComponent', () => {
  let component: TestprodComponent;
  let fixture: ComponentFixture<TestprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestprodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
