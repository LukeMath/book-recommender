import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { BookRecommenderComponent } from './book-recommender.component';

describe('BookRecommenderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [
        BookRecommenderComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(BookRecommenderComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
