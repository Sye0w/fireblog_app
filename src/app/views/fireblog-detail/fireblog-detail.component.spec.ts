import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireblogDetailComponent } from './fireblog-detail.component';

describe('FireblogDetailComponent', () => {
  let component: FireblogDetailComponent;
  let fixture: ComponentFixture<FireblogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FireblogDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FireblogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
