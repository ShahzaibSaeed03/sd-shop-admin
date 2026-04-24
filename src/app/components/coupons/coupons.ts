import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css',
})
export class Coupons implements OnInit {

  API = 'http://localhost:5000/api/coupons';

  isOpen = false;
  isAnalyticsOpen = false;
  loading = false;

  coupons: any[] = [];
  selectedCoupon: any = null;
activeCount = 0;
disabledCount = 0;
  // =========================
  // 🔥 DROPDOWN (PRODUCT/CATEGORY)
  // =========================
  openDropdown = false;
  searchQuery = '';
  searchResults: any[] = [];
  selectedItems: any[] = [];
currentPage = 1;
limit = 10;
totalPages = 1;
total = 0;
  // =========================
  // FORM
  // =========================
  form: any = {
    _id: null,
    code: '',
    type: 'percentage',
    value: 0,
    appliesTo: 'all',
    products: [],
    categories: [],
    minOrderAmount: 0,
    maxDiscount: null,
    usageLimit: null,
    expiresAt: '',
    isActive: true,
    avatarFile: null,
    avatarPreview: null
  };
filterStatus: 'all' | 'active' | 'disabled' = 'all';
  // =========================
  // ANALYTICS
  // =========================
  analytics: any = {
    startDate: null,
    endDate: null,
    revenue: 0,
    totalRevenue: 0
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCoupons();
  }
setFilter(status: 'all' | 'active' | 'disabled') {
  this.filterStatus = status;
  this.currentPage = 1; // reset page
  this.getCoupons();
}
  // =========================
  // GET LIST
  // =========================
getCoupons() {
  this.loading = true;

  this.http.get(`${this.API}?page=${this.currentPage}&limit=${this.limit}&status=${this.filterStatus}`)
    .subscribe({
      next: (res: any) => {
        this.coupons = res.data || [];
        this.total = res.total || 0;
        this.totalPages = res.totalPages || 1;

        this.loading = false;
      },
      error: () => this.loading = false
    });
}
changePage(page: number) {

  if (page < 1 || page > this.totalPages) return;

  this.currentPage = page;
  this.getCoupons();
}

  // =========================
  // CREATE / UPDATE
  // =========================
  createCoupon() {

    if (!this.form.code || !this.form.value) {
      alert('Code & value required');
      return;
    }

    const fd = new FormData();

    Object.keys(this.form).forEach(key => {

      if (
        this.form[key] !== null &&
        key !== 'avatarPreview' &&
        key !== 'avatarFile'
      ) {

        if (Array.isArray(this.form[key])) {
          this.form[key].forEach((val: any) => {
            fd.append(key, val);
          });
        } else {
          fd.append(key, this.form[key]);
        }

      }
    });

    // ✅ correct field
    if (this.form.avatarFile) {
      fd.append('avatar', this.form.avatarFile);
    }

    if (this.form._id) {
      this.http.put(`${this.API}/${this.form._id}`, fd).subscribe({
        next: () => this.afterSave(),
        error: (err) => alert(err.error?.message || 'Update failed')
      });
    } else {
      this.http.post(this.API, fd).subscribe({
        next: () => this.afterSave(),
        error: (err) => alert(err.error?.message || 'Create failed')
      });
    }
  }
  afterSave() {
    this.isOpen = false;
    this.resetForm();
    this.getCoupons();
  }

  // =========================
  // EDIT
  // =========================
editCoupon(c: any) {
  this.form = {
    ...c,
    expiresAt: c.expiresAt ? c.expiresAt.substring(0, 10) : '',
    avatarFile: null,
    avatarPreview: c.avatar || null   // 🔥 show existing image
  };

  this.selectedItems = c.products?.length
    ? c.products
    : c.categories || [];

  this.isOpen = true;
}

  // =========================
  // TOGGLE STATUS
  // =========================
  toggleStatus(c: any) {
    this.http.put(`${this.API}/${c._id}`, {
      isActive: !c.isActive
    }).subscribe(() => {
      c.isActive = !c.isActive;
    });
  }

  // =========================
  // DELETE
  // =========================
  deleteCoupon(id: string) {
    if (!confirm('Delete this coupon?')) return;

    this.http.delete(`${this.API}/${id}`).subscribe(() => {
      this.getCoupons();
    });
  }

  // =========================
  // ANALYTICS
  // =========================
  openAnalytics(coupon: any) {
    this.selectedCoupon = coupon;
    this.isAnalyticsOpen = true;
  }

  // =========================
  // FORMAT PRICE
  // =========================
  formatPrice(price: number): string {
    if (!price) return '$0';
    return '$' + price.toLocaleString();
  }

  // =========================
  // RESET FORM
  // =========================
  resetForm() {
    this.form = {
      _id: null,
      code: '',
      type: 'percentage',
      value: 0,
      appliesTo: 'all',
      products: [],
      categories: [],
      minOrderAmount: 0,
      maxDiscount: null,
      usageLimit: null,
      expiresAt: '',
      isActive: true,

      avatarFile: null,
      avatarPreview: null
    };

    this.selectedItems = [];
    this.searchResults = [];
    this.searchQuery = '';
  }

  // =========================
  // 🔥 DROPDOWN LOGIC
  // =========================

  toggleDropdown() {
    this.openDropdown = !this.openDropdown;

    if (this.openDropdown) {
      this.onSearch();
    }
  }

  onSearch() {
    this.loading = true;

    const API =
      this.form.appliesTo === 'products'
        ? 'http://localhost:5000/api/products'
        : 'http://localhost:5000/api/categories';

    this.http.get(`${API}?search=${this.searchQuery}`).subscribe({
      next: (res: any) => {
        this.searchResults = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectItem(item: any) {
    const exists = this.selectedItems.find(i => i._id === item._id);

    if (exists) {
      this.selectedItems = this.selectedItems.filter(i => i._id !== item._id);
    } else {
      this.selectedItems.push(item);
    }

    // save ids
    if (this.form.appliesTo === 'products') {
      this.form.products = this.selectedItems.map(i => i._id);
    } else {
      this.form.categories = this.selectedItems.map(i => i._id);
    }
  }

  isSelected(item: any) {
    return this.selectedItems.some(i => i._id === item._id);
  }
  onAvatarUpload(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    // preview
    const reader = new FileReader();

    reader.onload = () => {
      this.form.avatarPreview = reader.result; // for UI preview
    };

    reader.readAsDataURL(file);

    // store file (for API)
    this.form.avatarFile = file;
  }
}