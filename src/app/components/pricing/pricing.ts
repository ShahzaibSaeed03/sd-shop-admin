import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements OnInit {

  page = 1;
  pageSize = 10;

  modalPage = 1;
  modalPageSize = 10;

  selectedCategory: any = null;

  defaultMarkup: number = 0;

  isManageModalOpen = false;

  // ✅ GAME LIST
  categories: any[] = [];

  // ✅ PRODUCTS OF SELECTED GAME
  modalProducts: any[] = [];

  Math = Math;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadCategories();
  }

  // =====================================================
  // LOAD GAMES / CATEGORIES
  // =====================================================

  loadCategories() {

    this.categoryService.getCategories().subscribe({

      next: (res: any) => {

        console.log('CATEGORIES:', res);

        this.categories = res.data || [];

        this.page = 1;
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  // =====================================================
  // PAGINATION
  // =====================================================

  get totalPages(): number {
    return Math.ceil(this.categories.length / this.pageSize) || 1;
  }

  get paginatedProducts() {

    const start = (this.page - 1) * this.pageSize;

    return this.categories.slice(start, start + this.pageSize);
  }

  get visiblePages(): number[] {

    const total = this.totalPages;
    const current = this.page;

    const range = 2;

    let start = Math.max(1, current - range);
    let end = Math.min(total, current + range);

    if (current <= 3) {
      end = Math.min(5, total);
    }

    if (current >= total - 2) {
      start = Math.max(total - 4, 1);
    }

    const pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  goToPage(p: number) {

    if (p < 1 || p > this.totalPages) return;

    this.page = p;
  }

  // =====================================================
  // MODAL PAGINATION
  // =====================================================

  get modalTotalPages(): number {
    return Math.ceil(this.modalProducts.length / this.modalPageSize) || 1;
  }

  get paginatedModalProducts() {

    const start = (this.modalPage - 1) * this.modalPageSize;

    return this.modalProducts.slice(start, start + this.modalPageSize);
  }

  modalNext() {
    if (this.modalPage < this.modalTotalPages) {
      this.modalPage++;
    }
  }

  modalPrev() {
    if (this.modalPage > 1) {
      this.modalPage--;
    }
  }

  goToModalPage(p: number) {

    if (p < 1 || p > this.modalTotalPages) return;

    this.modalPage = p;
  }

  // =====================================================
  // OPEN GAME PRODUCTS
  // =====================================================

  openManage(category: any) {

    this.selectedCategory = category;

    this.isManageModalOpen = true;

    this.modalPage = 1;

    this.defaultMarkup = 0;

    this.productService.getByCategory(category._id).subscribe({

      next: (res: any) => {

        console.log('CATEGORY PRODUCTS:', res);

        this.modalProducts = res.data || [];

        // ✅ DEFAULT MARKUP
        if (this.modalProducts.length > 0) {
          this.defaultMarkup = this.modalProducts[0]?.markup || 0;
        }
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  closeModal() {

    this.isManageModalOpen = false;

    this.modalProducts = [];

    this.selectedCategory = null;
  }

  // =====================================================
  // FINAL PRICE
  // =====================================================

  getFinalPrice(product: any): number {

    const price = Number(product.price || 0);

    const markup = Number(product.markup || 0);

    return price + (price * markup / 100);
  }

  // =====================================================
  // UPDATE SINGLE PRODUCT MARKUP
  // =====================================================

  updateProductMarkup(product: any) {

    if (product.markup < 0 || product.markup > 500) {

      product.error = true;

      return;
    }

    product.error = false;

    this.productService.updateProduct(product._id, {

      markup: Number(product.markup)

    }).subscribe({

      next: () => {

        console.log('PRODUCT MARKUP UPDATED');
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  // =====================================================
  // UPDATE DISPLAY NAME
  // =====================================================

  updateDisplayName(product: any) {

    this.productService.updateProduct(product._id, {

      displayName: product.displayName || ''

    }).subscribe({

      next: () => {

        console.log('DISPLAY NAME UPDATED');
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  // =====================================================
  // DEFAULT MARKUP APPLY TO ALL
  // =====================================================

  updateDefaultMarkup() {

    if (this.defaultMarkup < 0 || this.defaultMarkup > 500) {

      alert('Max 500% allowed');

      return;
    }

    this.modalProducts.forEach((product: any) => {

      product.markup = Number(this.defaultMarkup);
    });
  }

  // =====================================================
  // TOGGLE PRODUCT ACTIVE
  // =====================================================

  toggleVisibility(product: any) {

    this.productService.updateProduct(product._id, {

      isActive: !product.isActive

    }).subscribe({

      next: () => {

        product.isActive = !product.isActive;
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  // =====================================================
  // RESET PRODUCT
  // =====================================================

  resetToDefault(product: any) {

    product.markup = 0;

    product.displayName = '';

    product.fixedPrice = null;

    product.isReset = true;
  }

  // =====================================================
  // SAVE ALL PRODUCTS
  // =====================================================

  saveAllChanges() {

    const requests = this.modalProducts.map((product: any) => {

      return this.productService.updateProduct(product._id, {

        markup: Number(product.markup || 0),

        displayName: product.displayName || '',

        isActive: product.isActive,

        fixedPrice: product.fixedPrice || null
      });
    });

    Promise.all(requests.map((r: any) => r.toPromise()))

      .then(() => {

        console.log('ALL SAVED');

        this.isManageModalOpen = false;

        this.loadCategories();
      })

      .catch((err) => {

        console.error(err);
      });
  }

  // =====================================================
  // SYNC PRODUCTS
  // =====================================================

  syncProducts() {

    this.productService.syncProducts().subscribe({

      next: () => {

        console.log('PRODUCTS SYNCED');

        this.loadCategories();

        if (this.selectedCategory?._id) {

          this.openManage(this.selectedCategory);
        }
      },

      error: (err) => {

        console.error('SYNC FAILED', err);
      }
    });
  }

}