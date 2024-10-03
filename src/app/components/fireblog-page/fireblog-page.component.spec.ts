import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireblogPageComponent } from './fireblog-page.component';

describe('FireblogPageComponent', () => {
  let component: FireblogPageComponent;
  let fixture: ComponentFixture<FireblogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FireblogPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FireblogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
