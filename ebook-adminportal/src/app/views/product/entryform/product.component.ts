import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import Editor from 'quill/core/editor';
import { UppyService } from '@/app/core/service/uppy.service';
import Uppy from '@uppy/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '@/app/core/service/product.service';
import { ProductGroupService } from '@/app/core/service/productgroup.service';
import { CategoryService } from '@/app/core/service/category.service';
import { SweetAlertService } from '@/app/core/service/sweet-alert.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [QuillEditorComponent, RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product.component.html',
  styles: ``
})
export class ProductComponent implements OnInit, OnDestroy {

  private uppyService = inject(UppyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private groupService = inject(ProductGroupService);
  private categoryService = inject(CategoryService);
  private alert = inject(SweetAlertService);
  private fb = inject(UntypedFormBuilder);

  productForm: UntypedFormGroup;
  lstProductGroup: any[] = [];
  lstProductCategory: any[] = [];
  selectedFiles: File[] = [];
  loading = false;
  isEditMode = false;
  productId?: number;

  editor!: Editor;
  content: string = '<div id="editor"></div>';
  public model = {
    editorData: this.content,
  };

  editorConfig = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  editorConfigBubble = {
    toolbar: [
      ['bold', 'italic', 'link', 'blockquote'],
      [{ header: 1 }, { header: 2 }],
    ],
  };

  private uppyInstance!: Uppy;
  imageUrl: string | ArrayBuffer | null = null;
  private uuid = 'unique-id';

  constructor() {
    this.productForm = this.fb.group({
      groupId: [null, Validators.required],
      categoryId: [null, Validators.required],
      productCode: [''],
      productName: ['', Validators.required],
      shortDescription: [''],
      images: [null]
    });
  }

  ngOnInit(): void {
    this.loadProductGroups();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProductDetails(id);
    }

    const pluginConfig: [string, any][] = [
      [
        'Dashboard',
        {
          inline: true,
          target: '#drag-drop-area',
        },
      ],
      ['Tus', { endpoint: 'https://tusd.tusdemo.net/files/' }],
    ];

    this.uppyInstance = this.uppyService.configure(pluginConfig, this.uuid);
  }

  ngOnDestroy(): void {
    if (this.uppyInstance) {
      this.uppyInstance.close();
    }
  }

  loadProductGroups(): void {
    this.groupService.getCategoryGroups().subscribe({
      next: (groups) => {
        this.lstProductGroup = groups;
        if (groups.length > 0 && !this.productForm.value.groupId) {
          this.productForm.patchValue({ groupId: groups[0].groupid });
          this.loadProductCategoriesByGroupID(groups[0].groupid);
        }
      },
      error: () => {
        this.alert.error('Unable to load groups', 'Please try again later.');
      }
    });
  }

  loadProductCategoriesByGroupID(groupId: number): void {
    if (!groupId) {
      return;
    }

    this.lstProductCategory = [];
    this.categoryService.getCategories(groupId).subscribe({
      next: (categories) => {
        this.lstProductCategory = categories;
      },
      error: () => {
        this.alert.error('Unable to load categories', 'Please try again later.');
      }
    });
  }

  loadProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          groupId: product.groupid,
          categoryId: product.categoryid,
          productCode: product.productcode,
          productName: product.productname,
          shortDescription: product.shortdescription
        });

        if (product.groupid) {
          this.loadProductCategoriesByGroupID(product.groupid);
        }
      },
      error: () => {
        this.alert.error('Unable to load product', 'Please try again later.');
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFiles[0]);
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.alert.warning('Please fill required fields before saving.');
      return;
    }

    this.loading = true;

    const payload = {
      productcode: this.productForm.value.productCode?.trim(),
      productname: this.productForm.value.productName.trim(),
      shortdescription: this.productForm.value.shortDescription?.trim() || '',
      categoryid: Number(this.productForm.value.categoryId),
      subcategoryid: null,
      deptid: null,
      storeid: null,
      createdby: 1,
      modifiedby: 1,
      images: this.selectedFiles
    };

    const action$ = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, payload)
      : this.productService.createProduct(payload);

    action$.subscribe({
      next: () => {
        this.alert.success('Product saved', 'Product information was saved successfully.');
        this.loading = false;
        this.router.navigate(['/product/details']);
      },
      error: () => {
        this.loading = false;
        this.alert.error('Save failed', 'Unable to save the product.');
      }
    });
  }
}
