import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendedCardComponent } from './recommended-card.component';

describe('FlashSaleCardComponent', () => {
  let component: RecommendedCardComponent;
  let fixture: ComponentFixture<RecommendedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
