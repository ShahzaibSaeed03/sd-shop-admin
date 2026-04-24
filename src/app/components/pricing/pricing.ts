import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pricing',
  imports: [CommonModule, FormsModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements OnInit {
  page = 1;
  pageSize = 10;
  modalPage = 1;
  modalPageSize = 10;
  selectedProduct: any = null;
  defaultMarkup: number = 0;

  isManageModalOpen = false;

  products: any[] = [];
  modalProducts: any[] = [];

  Math = Math;

  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data || [];
      },
      error: (err) => console.error(err)
    });
  }
  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize) || 1;
  }

  get paginatedProducts() {
    const start = (this.page - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  get modalTotalPages(): number {
    return Math.ceil(this.modalProducts.length / this.modalPageSize) || 1;
  }

  get paginatedModalProducts() {
    const start = (this.modalPage - 1) * this.modalPageSize;
    return this.modalProducts.slice(start, start + this.modalPageSize);
  }
  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.page;

    const range = 2; // kitne pages show karne hain left/right

    let start = Math.max(1, current - range);
    let end = Math.min(total, current + range);

    // ensure at least 5 pages show ho
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
  modalNext() {
    if (this.modalPage < this.modalTotalPages) this.modalPage++;
  }

  modalPrev() {
    if (this.modalPage > 1) this.modalPage--;
  }

  goToModalPage(p: number) {
    if (p < 1 || p > this.modalTotalPages) return;
    this.modalPage = p;
  }
  // ✅ update markup
  updateMarkup(product: any) {

    if (product.markup < 0 || product.markup > 500) {
      product.error = true;
      return;
    }

    product.error = false;

    this.productService.updateProduct(product._id, {
      markup: product.markup
    }).subscribe({
      next: () => console.log('updated'),
      error: (err) => console.error(err)
    });
  }

  // ✅ final price
  getFinalPrice(product: any) {
    return product.price + (product.price * (product.markup || 0) / 100);
  }


  // OPEN MODAL
  openManage(product: any) {

    const categoryId = product.category?._id;

    this.selectedProduct = product;
    this.defaultMarkup = product.markup || 0;
    this.isManageModalOpen = true;

    this.modalPage = 1; // ✅ reset

    if (categoryId) {
      this.productService.getByCategory(categoryId).subscribe({
        next: (res: any) => {
          this.modalProducts = res.data || [];
        }
      });
    } else {
      this.modalProducts = [product];
    }
  }

  closeModal() {
    this.isManageModalOpen = false;
    this.modalProducts = [];
  }
  // DEFAULT MARKUP CHANGE
updateDefaultMarkup() {

  if (!this.selectedProduct) return;

  if (this.defaultMarkup > 500) {
    alert('Max 500% allowed');
    return;
  }

  // ✅ ONLY SAME CATEGORY PRODUCTS
  this.modalProducts.forEach((product: any) => {
    product.markup = this.defaultMarkup;
  });

}

  // PRODUCT LEVEL MARKUP
  updateProductMarkup(product: any) {
    if (product.markup > 500) {
      product.error = true;
      return;
    }

    product.error = false;

    this.productService.updateProduct(product._id, {
      markup: product.markup
    }).subscribe();
  }

  // TOGGLE VISIBILITY
  toggleVisibility(product: any) {
    this.productService.updateProduct(product._id, {
      isActive: !product.isActive
    }).subscribe(() => {
      product.isActive = !product.isActive;
    });
  }

  saveAllChanges() {
    const requests = this.modalProducts.map((p: any) => {
      return this.productService.updateProduct(p._id, {
        markup: p.markup || 0,
        displayName: p.displayName || '', // ✅ important
        isActive: p.isActive
      });
    });

    Promise.all(requests.map(r => r.toPromise()))
      .then(() => {
        this.isManageModalOpen = false;
        this.loadProducts();
      })
      .catch(err => console.error(err));
  }
  syncProducts() {
    this.productService.syncProducts().subscribe({
      next: () => {
        console.log('Products synced');

        // reload products after sync
        this.loadProducts();
      },
      error: (err) => {
        console.error('Sync failed', err);
      }
    });
  }

  updateDisplayName(product: any) {
    this.productService.updateProduct(product._id, {
      displayName: product.displayName
    }).subscribe({
      next: () => console.log('Display name updated'),
      error: (err) => console.error(err)
    });
  }
  resetToDefault(product: any) {
    product.markup = 0;
    product.displayName = '';

    // optional UI flag
    product.isReset = true;
  }
}