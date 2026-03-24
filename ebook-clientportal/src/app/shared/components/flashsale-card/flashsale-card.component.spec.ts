import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashSaleCardComponent } from './flashsale-card.component';

describe('FlashSaleCardComponent', () => {
  let component: FlashSaleCardComponent;
  let fixture: ComponentFixture<FlashSaleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashSaleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashSaleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
