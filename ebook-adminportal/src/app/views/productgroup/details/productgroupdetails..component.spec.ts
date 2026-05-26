import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductGroupDetailsComponent } from './productgroupdetails.component'

describe('ProductGroupDetailsComponent', () => {
  let component: ProductGroupDetailsComponent
  let fixture: ComponentFixture<ProductGroupDetailsComponent>
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGroupDetailsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductGroupDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
