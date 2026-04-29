import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-img-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './img-management.html',
  styleUrl: './img-management.css',
})
export class ImgManagement implements OnInit {

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) { }

  // ================= DATA =================
  categories: any[] = [];
  currentPage = 1;
  limit = 5; // per page
  // ================= UI STATE =================
  expandedRowId: string | null = null;

  // store temp files per row
  selectedFiles: { [key: string]: File } = {};
  previewImages: { [key: string]: string | ArrayBuffer | null } = {};

  // ================= INIT =================
  ngOnInit() {
    this.loadCategories();
  }

  // ================= LOAD =================
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
      },
      error: (err) => console.error(err)
    });
  }
  get paginatedCategories() {
    const start = (this.currentPage - 1) * this.limit;
    const end = start + this.limit;
    return this.categories.slice(start, end);
  }
  // ================= TOGGLE ROW =================
  toggleManage(section: any) {
    this.expandedRowId =
      this.expandedRowId === section._id ? null : section._id;

    console.log('OPEN:', this.expandedRowId);
  }
  get total() {
    return this.categories.length;
  }
  toggleStatus(section: any) {

    const newStatus = !section.isActive;

    // UI update (instant feel)
    section.isActive = newStatus;

    const formData = new FormData();
    formData.append('isActive', String(newStatus));

    this.categoryService.updateCategory(section._id, formData)
      .subscribe({
        next: () => {
          console.log('✅ Status updated');
        },
        error: (err) => {
          console.error(err);

          // rollback UI if error
          section.isActive = !newStatus;
        }
      });
  }
  // ================= IMAGE SELECT =================
  onCategoryImageSelect(event: any, section: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFiles[section._id] = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImages[section._id] = reader.result;
    };
    reader.readAsDataURL(file);
  }
  nextPage() {
    if (this.currentPage * this.limit < this.total) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  // ================= GET PREVIEW =================
  getPreview(section: any) {
    return this.previewImages[section._id] || section.image;
  }

  // ================= UPDATE =================
  updateCategory(section: any) {

    const formData = new FormData();

    formData.append('name', section.name);
    formData.append('slug', section.slug);

    if (section.imageFile) {
      formData.append('image', section.imageFile);
    }

    this.categoryService.updateCategory(section._id, formData).subscribe({
      next: () => {
        section.image = section.preview || section.image;
        section.preview = null;
        section.imageFile = null;
        this.expandedRowId = null;
      },
      error: (err) => console.error(err)
    });
  }

  // ================= CANCEL =================
  cancelEdit() {
    this.expandedRowId = null;
    this.selectedFiles = {};
    this.previewImages = {};
  }

  // ================= NAV =================
  goToGameManagement(categoryId: string) {
    this.router.navigate(['/game-management', categoryId]);
  }
  onSectionImageChange(event: any, section: any) {
    const file = event.target.files[0];
    if (!file) return;

    section.imageFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      section.preview = reader.result;
    };

    reader.readAsDataURL(file);
  }
  removeSectionImage(section: any) {
    section.image = null;
    section.preview = null;
    section.file = null;
  }
}