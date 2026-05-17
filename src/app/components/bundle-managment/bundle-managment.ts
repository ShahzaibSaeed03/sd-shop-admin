import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BundleService } from '../../services/bundle.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-bundle-managment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './bundle-managment.html',
  styleUrl: './bundle-managment.css',
})
export class BundleManagment implements OnInit {

  constructor(
    private bundleService: BundleService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  // =========================
  // DATA
  // =========================

  bundles: any[] = [];

  categories: any[] = [];

  products: any[] = [];

  filteredCategories: any[] = [];

  filteredProducts: any[] = [];

  loading = false;

  saving = false;

  // =========================
  // MODAL
  // =========================

  modalOpen = false;

  modalMode: 'create' | 'edit' | 'view' = 'create';

  // =========================
  // DROPDOWN
  // =========================

  openCategoryDropdown = false;

  openProductDropdown = false;

  categorySearch = '';

  productSearch = '';

  // =========================
  // IMAGE
  // =========================

  selectedImage: File | null = null;

  imagePreview: any = null;

  // =========================
  // FORM
  // =========================

  form: any = {
    _id: '',
    name: '',
    category: '',
    baseProduct: '',
    quantity: 1,
    customPrice: 0,
    badge: '',
    description: '',
    rules: '',
    image: ''
  };

  ngOnInit() {

    this.loadBundles();

    this.loadCategories();

  }

  // =========================
  // LOAD
  // =========================

  loadBundles() {

    this.loading = true;

    this.bundleService
      .getBundles()
      .subscribe({

        next: (res: any) => {

          this.bundles =
            res.data || [];

          this.loading = false;

        },

        error: () => {

          this.loading = false;

        }

      });

  }

  loadCategories() {

    this.categoryService
      .getCategories()
      .subscribe({

        next: (res: any) => {

          this.categories =
            res.data || [];

          this.filteredCategories =
            this.categories;

        }

      });

  }

  // =========================
  // MODAL OPEN
  // =========================

  openModal(
    mode: 'create' | 'edit' | 'view',
    bundle?: any
  ) {

    this.modalMode = mode;

    this.modalOpen = true;

    // CREATE
    if (mode === 'create') {

      this.resetForm();

      return;

    }

    // EDIT / VIEW
    this.form = {
      ...bundle,
      category:
        bundle.category?._id ||
        bundle.category,

      baseProduct:
        bundle.baseProduct?._id ||
        bundle.baseProduct
    };

    this.categorySearch =
      bundle.category?.name || '';

    this.productSearch =
      bundle.baseProduct?.name || '';

    this.imagePreview =
      bundle.image;

    if (bundle.category?._id) {

      this.loadProducts(
        bundle.category._id
      );

    }

  }

  closeModal() {

    this.modalOpen = false;

    this.resetForm();

  }

  resetForm() {

    this.form = {
      _id: '',
      name: '',
      category: '',
      baseProduct: '',
      quantity: 1,
      customPrice: 0,
      badge: '',
      description: '',
      rules: '',
      image: ''
    };

    this.categorySearch = '';

    this.productSearch = '';

    this.products = [];

    this.filteredProducts = [];

    this.imagePreview = null;

    this.selectedImage = null;

  }

  // =========================
  // CATEGORY
  // =========================

  filterCategories() {

    const q =
      this.categorySearch
        .toLowerCase();

    this.filteredCategories =
      this.categories.filter((x: any) =>
        x.name
          .toLowerCase()
          .includes(q)
      );

  }

  selectCategory(category: any) {

    this.form.category =
      category._id;

    this.categorySearch =
      category.name;

    this.openCategoryDropdown =
      false;

    this.form.baseProduct = '';

    this.productSearch = '';

    this.loadProducts(
      category._id
    );

  }

  // =========================
  // PRODUCT
  // =========================

  loadProducts(categoryId: string) {

    this.productService
      .getByCategory(categoryId)
      .subscribe({

        next: (res: any) => {

          this.products =
            res.data || [];

          this.filteredProducts =
            this.products;

        }

      });

  }

  filterProducts() {

    const q =
      this.productSearch
        .toLowerCase();

    this.filteredProducts =
      this.products.filter((x: any) =>
        x.name
          .toLowerCase()
          .includes(q)
      );

  }

  selectProduct(product: any) {

    this.form.baseProduct =
      product._id;

    this.productSearch =
      product.name;

    this.openProductDropdown =
      false;

    if (
      !this.form.customPrice
    ) {

      this.form.customPrice =
        product.price;

    }

  }

  // =========================
  // IMAGE
  // =========================

  onImageSelect(event: any) {

    const file =
      event.target.files[0];

    if (!file) return;

    this.selectedImage = file;

    const reader =
      new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result;

    };

    reader.readAsDataURL(file);

  }

  getPreview() {

    return (
      this.imagePreview ||
      this.form.image ||
      'https://placehold.co/600x600/E2E8F0/64748B?text=Bundle'
    );

  }

  // =========================
  // SAVE
  // =========================

  saveBundle() {

    const formData =
      new FormData();

    Object.keys(this.form)
      .forEach(key => {

        formData.append(
          key,
          this.form[key]
        );

      });

    if (this.selectedImage) {

      formData.append(
        'image',
        this.selectedImage
      );

    }

    this.saving = true;

    // CREATE
    if (
      this.modalMode === 'create'
    ) {

      this.bundleService
        .createBundle(formData)
        .subscribe({

          next: () => {

            this.afterSave();

          }

        });

    }

    // UPDATE
    else {

      this.bundleService
        .updateBundle(
          this.form._id,
          formData
        )
        .subscribe({

          next: () => {

            this.afterSave();

          }

        });

    }

  }

  afterSave() {

    this.saving = false;

    this.closeModal();

    this.loadBundles();

  }

  // =========================
  // DELETE
  // =========================

  deleteBundle(id: string) {

    const ok =
      confirm(
        'Delete bundle?'
      );

    if (!ok) return;

    this.bundleService
      .deleteBundle(id)
      .subscribe({

        next: () => {

          this.closeModal();

          this.loadBundles();

        }

      });

  }

  // =========================
  // OUTSIDE CLICK
  // =========================

  @HostListener(
    'document:click',
    ['$event']
  )
  closeDropdowns(event: any) {

    const target =
      event.target;

    if (
      !target.closest(
        '.category-dropdown'
      )
    ) {

      this.openCategoryDropdown =
        false;

    }

    if (
      !target.closest(
        '.product-dropdown'
      )
    ) {

      this.openProductDropdown =
        false;

    }

  }

}