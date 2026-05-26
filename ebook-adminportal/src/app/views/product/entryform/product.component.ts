import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { QuillEditorComponent } from 'ngx-quill'
import Editor from 'quill/core/editor'
import { UppyService } from '@/app/core/service/uppy.service'
import Uppy from '@uppy/core'
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [QuillEditorComponent, RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './product.component.html',
    styles: ``
})
export class ProductComponent {

  lstProductGroup: any = [
      { id: 1, sno : 1, groupname: 'General Books' },
      { id: 2, sno : 2, groupname: 'Text Books' },
      { id: 3, sno : 3, groupname: 'Stationary' },
      { id: 4, sno : 4, groupname: 'Furniture' },
      { id: 5, sno : 5, groupname: 'E-Books' },
      { id: 6, sno : 6, groupname: 'Toys' },
      { id: 7, sno : 7, groupname: 'Arts & Crafts' },
      { id: 8, sno : 8, groupname: 'Clothing' },
      { id: 9, sno : 9, groupname: 'Electronics' },
      { id: 10, sno : 10, groupname: 'Digital Gift Cards' }
    ];

    lstProductCategory: any = [
      { id: 1, sno : 1, categoryname: 'General Books' },
      { id: 2, sno : 2, categoryname: 'Text Books' },
      { id: 3, sno : 3, categoryname: 'Stationary' },
      { id: 4, sno : 4, categoryname: 'Furniture' },
      { id: 5, sno : 5, categoryname: 'E-Books' },
      { id: 6, sno : 6, categoryname: 'Toys' },
      { id: 7, sno : 7, categoryname: 'Arts & Crafts' },
      { id: 8, sno : 8, categoryname: 'Clothing' },
      { id: 9, sno : 9, categoryname: 'Electronics' },
      { id: 10, sno : 10, categoryname: 'Digital Gift Cards' }
    ];

editor!: Editor
  content: string = ` <div id="editor">
                </div>`
  public model = {
    editorData: this.content,
  }

  editorConfig = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  }

  editorConfigBubble = {
    toolbar: [
      ['bold', 'italic', 'link', 'blockquote'],
      [{ header: 1 }, { header: 2 }],
    ],
  }

  private uppyInstance!: Uppy
  imageUrl: string | ArrayBuffer | null = null

  private uuid: string = 'unique-id'

  constructor(private uppyService: UppyService) {}

ngOnInit(): void {
    const pluginConfig: [string, any][] = [
      [
        'Dashboard',
        {
          inline: true,
          target: '#drag-drop-area',
        },
      ],
      ['Tus', { endpoint: 'https://tusd.tusdemo.net/files/' }],
    ]

    this.uppyInstance = this.uppyService.configure(pluginConfig, this.uuid)
  }

  ngOnDestroy(): void {
    if (this.uppyInstance) {
      this.uppyInstance.close()
    }
  }

  handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    if (inputElement.files && inputElement.files.length > 0) {
      const uploadedFile = inputElement.files[0]
      this.readFile(uploadedFile)
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader()
    reader.onload = () => {
      // Set the preview image src
      this.imageUrl = reader.result as string
    }

    reader.readAsDataURL(file) // Read file as base64
  }

    

}
