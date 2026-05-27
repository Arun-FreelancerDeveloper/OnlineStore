import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../../../../core/services/category/category.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const mockProductService = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of({
      success: true,
      message: '',
      data: {
        currentPage: 1,
        pageSize: 8,
        totalPages: 1,
        totalRecords: 0,
        data: []
      }
    }))
  };

  const mockCategoryService = {
    getCategoryGroups: jasmine.createSpy('getCategoryGroups').and.returnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ActivatedRoute, useValue: {
          paramMap: of(convertToParamMap({})),
          queryParamMap: of(convertToParamMap({}))
        }}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
