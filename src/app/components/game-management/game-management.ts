import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-management.html',
  styleUrl: './game-management.css',
})
export class GameManagement implements OnInit {
  page = 1;
  pageSize = 4; // rows per page
  products: any[] = [];
  expandedProductId: string | null = null;

  selectedFiles: { [key: string]: File } = {};
  previewImages: { [key: string]: string | ArrayBuffer | null } = {};
  categoryId!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    this.loadProducts();
  }
  toggleExpand(product: any) {
    this.expandedProductId =
      this.expandedProductId === product._id ? null : product._id;
  }
  loadProducts() {
    this.productService.getByCategory(this.categoryId).subscribe({
      next: (res: any) => {
        this.products = res.data || [];
      },
      error: (err) => console.error(err)
    });
  }
getEndIndex(): number {
  return Math.min(this.page * this.pageSize, this.products.length);
}
  goToImageManagement() {
    this.router.navigate(['/img-management']);
  }
  onProductImageSelect(event: any, product: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFiles[product._id] = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImages[product._id] = reader.result;
    };
    reader.readAsDataURL(file);
  }
  getPreview(product: any) {
    return this.previewImages[product._id] || product.image;
  }
  updateProduct(product: any) {
    const formData = new FormData();

    formData.append('name', product.name);

    if (this.selectedFiles[product._id]) {
      formData.append('image', this.selectedFiles[product._id]);
    }

    this.productService.updateProduct(product._id, formData)
      .subscribe({
        next: () => {
          this.expandedProductId = null;
          this.loadProducts();
        }
      });
  }

  toggleStatus(product: any) {
    const data = {
      isActive: !product.isActive
    };

    this.productService.updateProduct(product._id, data)
      .subscribe(() => {
        product.isActive = !product.isActive;
      });
  }


  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize) || 1;
  }

  get paginatedProducts() {
    const start = (this.page - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }
}