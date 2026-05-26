import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProductCategoryDetailsComponent } from './productcategorydetails.component'

describe('ProductCategoryDetailsComponent', () => {
  let component: ProductCategoryDetailsComponent
  let fixture: ComponentFixture<ProductCategoryDetailsComponent>
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryDetailsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductCategoryDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
