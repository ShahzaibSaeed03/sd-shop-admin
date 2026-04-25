import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BannerService } from '../../services/banner.service';
import { ProductService } from '../../services/product.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SectionService } from '../../services/section.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './content-management.html',
  styleUrl: './content-management.css',
})
export class ContentManagement {
  searchQuery = '';
  searchResults: any[] = [];
  loading = false;
  searchTimeout: any;

  // ================= UI =================
  isDropdownOpen = false;
  isSectionModalOpen = false;
  openGameDropdown = false;
  isAddingBanner = false;

  // ================= DATA =================
  banners: any[] = [];
  selectedDevice: 'desktop' | 'mobile' = 'desktop';
  selectedOption = 'Top Games';
  currentPage = 1;
  itemsPerPage = 10;

  sectionMap: any = {
    'Top Games': 'top_games',
    'Hot Selling': 'hot_selling',
    Featured: 'featured',
    'New Releases': 'new_releases',
  };
  sections: any[] = [];
  showGameSelector = false;
  newSection: any = {
    name: '',
    mode: 'api',
    categories: [],
    openDropdown: false,
  };
  onSearch() {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.fetchGames();
    }, 400);
  }
  loadSections() {
    this.sectionService.getSections().subscribe({
      next: (res: any) => {
        console.log('SECTIONS:', res); // 👈 check

        this.sections = res.map((s: any) => ({
          ...s,
          manualCategories: s.categories || [],
        }));
      },
    });
  }
  removeCategoryFromNewSection(id: string) {
  this.newSection.categories = this.newSection.categories.filter(
    (c: any) => c._id !== id
  );
}
  fetchGames() {
    if (!this.searchQuery) {
      this.searchResults = [];
      return;
    }

    this.loading = true;

    this.categoryService.searchCategories(this.searchQuery).subscribe({
      next: (res: any) => {
        this.searchResults = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  categories: any[] = [];

  selectCategory(cat: any) {
    const exists = this.newSection.categories.find((c: any) => c._id === cat._id);

    if (exists) {
      alert('Category already added');
      return;
    }

    this.newSection.categories.push(cat);
  }
  // ================= NEW BANNER =================
  draftBanner: any = {
    link: '',
    desktopImage: null,
    mobileImage: null,
    desktopPreview: null,
    mobilePreview: null,
  };
  // ================= UI =================
  openModal = false; // 👈 required by HTML

  // ================= OPTIONS =================
  options = ['Top Games', 'Hot Selling', 'Featured', 'New Releases'];
  // ================= VIEW =================
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;
  @ViewChild('modalDropdownWrapper') modalDropdownWrapper!: ElementRef;
  @ViewChild('modalWrapper') modalWrapper!: ElementRef;

  constructor(
    private bannerService: BannerService,
    private productService: ProductService,
    private sectionService: SectionService,
    private categoryService: CategoryService,
  ) {}

  // ================= INIT =================
  ngOnInit() {
    this.loadBanners();
    this.loadSections();
    this.loadCategories();
  }
  setDevice(device: 'desktop' | 'mobile', banner: any) {
    banner.selectedDevice = device;
  }
 setMode(section: any, mode: 'api' | 'manual') {

  // 👉 NEW SECTION (modal)
  if (!section?._id) {
    section.mode = mode;

    if (mode === 'api') {
      section.categories = []; // ✅ correct
    }

    return;
  }

  // 👉 EXISTING SECTION
  section.mode = mode;

  const payload: any = { mode };

  if (mode === 'api') {
    payload.categories = [];     // ✅ FIXED (not products)
  }

  if (mode === 'manual') {
    payload.apiSource = null;
  }

  this.sectionService.updateSection(section._id, payload).subscribe();
}
  openGameSelectorForNewSection() {
    this.showGameSelector = true;
  }
  addToSection(section: any, cat: any) {
    const exists = section.manualCategories.find((c: any) => c._id === cat._id);
    if (exists) return;

    section.manualCategories.push(cat);

    const ids = section.manualCategories.map((c: any) => c._id);

    this.sectionService
      .updateSection(section._id, {
        categories: ids,
      })
      .subscribe();
  }

  // ✅ ADD THIS
  get paginatedCategories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.categories.slice(start, start + this.itemsPerPage);
  }
  toggleCategory(cat: any) {
    const updated = !cat.isActive;

    this.categoryService
      .updateCategory(cat._id, {
        isActive: updated,
      })
      .subscribe({
        next: () => (cat.isActive = updated),
        error: (err) => console.error(err),
      });
  }

  // ✅ NEW
  get totalPages() {
    return Math.ceil(this.categories.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  removeFromSection(section: any, catId: string) {
    section.manualCategories = section.manualCategories.filter((c: any) => c._id !== catId);

    const ids = section.manualCategories.map((c: any) => c._id);

    this.sectionService
      .updateSection(section._id, {
        categories: ids,
      })
      .subscribe();
  }
  updateSection(section: any) {
    this.sectionService
      .updateSection(section._id, {
        isActive: section.isActive,
      })
      .subscribe({
        error: (err) => console.error(err),
      });
  }
  deleteSection(id: string) {
    if (!confirm('Delete section?')) return;

    this.sectionService.deleteSection(id).subscribe({
      next: () => this.loadSections(),
      error: (err) => console.error(err),
    });
  }
  // ================= LOAD =================
  loadBanners() {
    const section = this.sectionMap[this.selectedOption];

    this.bannerService.getBanners(section).subscribe({
      next: (res: any) => {
        this.banners = res.map((b: any) => ({
          ...b,
          selectedDevice: 'desktop', // 👈 per banner
        }));
      },
      error: (err) => console.error(err),
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        console.log('CATEGORIES:', res);

        this.categories = res.data || []; // ✅ FIX
        this.currentPage = 1; // ✅ reset pagination
      },
      error: (err) => console.error(err),
    });
  }

  // ================= ADD BANNER =================
  startAddBanner() {
    this.isAddingBanner = true;

    this.draftBanner = {
      link: '',
      desktopImage: null,
      mobileImage: null,
      desktopPreview: null,
      mobilePreview: null,
    };
  }

  onDraftImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (this.selectedDevice === 'desktop') {
        this.draftBanner.desktopImage = file;
        this.draftBanner.desktopPreview = reader.result;
      } else {
        this.draftBanner.mobileImage = file;
        this.draftBanner.mobilePreview = reader.result;
      }
    };

    reader.readAsDataURL(file);
  }

  confirmCreateBanner() {
    if (!this.draftBanner.desktopImage) {
      alert('Desktop image required');
      return;
    }

    const formData = new FormData();

    formData.append('desktopImage', this.draftBanner.desktopImage);

    if (this.draftBanner.mobileImage) {
      formData.append('mobileImage', this.draftBanner.mobileImage);
    }

    formData.append('link', this.draftBanner.link);
    formData.append('section', this.sectionMap[this.selectedOption]);

    this.bannerService.createBanner(formData).subscribe({
      next: () => {
        this.isAddingBanner = false;

        // 🔥 reset
        this.draftBanner = {
          link: '',
          desktopImage: null,
          mobileImage: null,
          desktopPreview: null,
          mobilePreview: null,
        };

        this.loadBanners();
      },
      error: (err) => console.error('Create error:', err),
    });
  }

  // ================= UPDATE =================
  updateBanner(banner: any) {
    this.bannerService
      .updateBanner(banner._id, {
        link: banner.link,
      })
      .subscribe({
        error: (err) => console.error('Update error:', err),
      });
  }

  onReplaceImage(event: any, banner: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();

    if (banner.selectedDevice === 'desktop') {
      formData.append('desktopImage', file);
    } else {
      formData.append('mobileImage', file);
    }

    this.bannerService.updateBanner(banner._id, formData).subscribe({
      next: () => this.loadBanners(),
      error: (err) => console.error(err),
    });
  }
  // ================= DELETE =================
  deleteBanner(id: string) {
    if (!confirm('Delete banner?')) return;

    this.bannerService.deleteBanner(id).subscribe({
      next: () => this.loadBanners(),
      error: (err) => console.error('Delete error:', err),
    });
  }
  trackById(index: number, item: any) {
    return item._id;
  }
  // ================= DRAG =================
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.banners, event.previousIndex, event.currentIndex);

    // update order locally
    this.banners = this.banners.map((b, i) => ({
      ...b,
      order: i,
    }));

    const payload = this.banners.map((b) => ({
      id: b._id,
      order: b.order,
    }));

    console.log('UPDATED ORDER:', payload);

    this.bannerService.reorder(payload).subscribe({
      next: () => console.log('REORDER SUCCESS'),
      error: (err) => console.error(err),
    });
  }

  // ================= PRODUCT =================
  toggleProduct(product: any) {
    const updated = !product.isActive;

    this.productService
      .updateProduct(product._id, {
        isActive: updated,
      })
      .subscribe({
        next: () => (product.isActive = updated),
        error: (err) => console.error('Toggle error:', err),
      });
  }

  // ================= DROPDOWN =================
  selectOption(option: string) {
    this.selectedOption = option; // ✅ IMPORTANT
    this.isDropdownOpen = false;
    this.loadBanners();
  }
  // ================= OUTSIDE CLICK =================
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.openGameDropdown &&
      this.modalDropdownWrapper &&
      !this.modalDropdownWrapper.nativeElement.contains(event.target)
    ) {
      this.openGameDropdown = false;
    }

    if (
      this.isDropdownOpen &&
      this.dropdownWrapper &&
      !this.dropdownWrapper.nativeElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
    }

    if (
      this.isSectionModalOpen &&
      this.modalWrapper &&
      !this.modalWrapper.nativeElement.contains(event.target)
    ) {
      this.isSectionModalOpen = false;
    }
  }

createSection() {

  // ✅ MANUAL MODE VALIDATION ONLY
  if (this.newSection.mode === 'manual' && !this.newSection.name) {
    alert('Section name required');
    return;
  }

  if (this.newSection.mode === 'manual' && this.newSection.categories.length === 0) {
    alert('Add at least 1 category');
    return;
  }

  // ✅ FIX: ALWAYS HAVE NAME
  const finalName =
    this.newSection.mode === 'api'
      ? this.selectedOption || 'Section'
      : this.newSection.name;

  const payload = {
    name: finalName, // ✅ IMPORTANT
    mode: this.newSection.mode,
    apiSource:
      this.newSection.mode === 'api'
        ? this.sectionMap[this.selectedOption]
        : null,

    categories:
      this.newSection.mode === 'manual'
        ? this.newSection.categories.map((c: any) => c._id)
        : [],

    isActive: true,
  };

  console.log('FINAL PAYLOAD:', payload); // 👈 DEBUG

  this.sectionService.createSection(payload).subscribe(() => {
    this.isSectionModalOpen = false;
    this.loadSections();
  });
}

  activeSection: any = null;
  showSectionGameModal = false;
  toggleSectionDropdown(section: any) {
    section.openDropdown = !section.openDropdown;
  }
  openSectionGameModal(section: any) {
    this.activeSection = section;
    this.showSectionGameModal = true;
  }
}
