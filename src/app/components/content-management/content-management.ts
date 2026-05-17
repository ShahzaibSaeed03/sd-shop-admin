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

loadSections() {

  this.sectionService.getSections().subscribe({

    next: (res: any) => {

      console.log('📦 SECTIONS RESPONSE:', res);

      const data = Array.isArray(res)
        ? res
        : (res.data || []);

      this.sections = data.map((s: any) => ({
        ...s,
        manualCategories: s.categories || [],
        openDropdown: false
      }));
    },

    error: (err) => {
      console.error('❌ SECTION LOAD ERROR:', err);
    }
  });
}



  categories: any[] = [];

 
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
// =====================================================
// SEARCH
// =====================================================

onSearch() {

  this.openGameDropdown = true;

  const value = this.searchQuery
    .toLowerCase()
    .trim();

  if (!value) {

    this.searchResults = [...this.categories];

    return;
  }

  this.searchResults = this.categories.filter(
    (item: any) =>
      item.name.toLowerCase().includes(value)
  );

}

// =====================================================
// FETCH GAMES
// =====================================================

fetchGames() {

  const query = this.searchQuery?.trim();

  if (!query) {
    this.searchResults = [];
    this.loading = false;
    return;
  }

  this.categoryService.searchCategories(query).subscribe({

    next: (res: any) => {

      let results: any[] = [];

      if (Array.isArray(res)) {
        results = res;
      }
      else if (Array.isArray(res?.data)) {
        results = res.data;
      }
      else if (Array.isArray(res?.categories)) {
        results = res.categories;
      }
      else if (Array.isArray(res?.results)) {
        results = res.results;
      }

      // REMOVE DUPLICATES
      this.searchResults = results.filter(
        (item, index, self) =>
          index === self.findIndex((x) => x._id === item._id)
      );

      this.loading = false;
    },

    error: (err) => {

      console.error(err);

      this.loading = false;
      this.searchResults = [];
    }
  });
}

// =====================================================
// SELECT CATEGORY
// =====================================================

selectCategory(cat: any) {

  const exists = this.newSection.categories.find(
    (c: any) => c._id === cat._id
  );

  if (exists) {
    return;
  }

  this.newSection.categories.push(cat);

  // RESET SEARCH
  this.searchQuery = '';
  this.searchResults = [];
  this.openGameDropdown = false;
}

// =====================================================
// REMOVE CATEGORY
// =====================================================

removeCategoryFromNewSection(id: string) {

  this.newSection.categories =
    this.newSection.categories.filter(
      (c: any) => c._id !== id
    );
}

// =====================================================
// SET MODE
// =====================================================

setMode(
  section: any,
  mode: 'api' | 'manual'
) {

  // =========================================
  // NEW SECTION
  // =========================================

  if (!section?._id) {

    this.newSection.mode = mode;

    // RESET SEARCH
    this.searchQuery = '';
    this.searchResults = [];
    this.openGameDropdown = false;

    // API MODE
    if (mode === 'api') {

      this.newSection.categories = [];

    }

    // MANUAL MODE
    if (mode === 'manual') {

      this.selectedOption = 'Top Games';

    }

    return;
  }

  // =========================================
  // EXISTING SECTION
  // =========================================

  section.mode = mode;

  const payload: any = {
    mode
  };

  if (mode === 'api') {

    payload.apiSource =
      section.apiSource || 'top_games';

    payload.categories = [];
  }

  if (mode === 'manual') {

    payload.apiSource = null;
  }

  this.sectionService
    .updateSection(section._id, payload)
    .subscribe({

      next: () => {
        console.log('SECTION UPDATED');
      },

      error: (err) => {
        console.error(err);
      }
    });
}

// =====================================================
// CREATE SECTION
// =====================================================

createSection() {

  // =========================
  // MANUAL VALIDATION
  // =========================

  if (
    this.newSection.mode === 'manual' &&
    !this.newSection.name?.trim()
  ) {

    alert('Section name required');
    return;
  }

  if (
    this.newSection.mode === 'manual' &&
    this.newSection.categories.length === 0
  ) {

    alert('Add at least 1 game');
    return;
  }

  // =========================
  // PAYLOAD
  // =========================

  const payload = {

    name:
      this.newSection.mode === 'api'
        ? this.selectedOption
        : this.newSection.name,

    mode: this.newSection.mode,

    apiSource:
      this.newSection.mode === 'api'
        ? this.sectionMap[this.selectedOption]
        : null,

    categories:
      this.newSection.mode === 'manual'
        ? this.newSection.categories.map(
            (c: any) => c._id
          )
        : [],

    isActive: true
  };

  console.log('FINAL PAYLOAD:', payload);

  // =========================
  // CREATE
  // =========================

  this.sectionService
    .createSection(payload)
    .subscribe({

      next: () => {

        this.isSectionModalOpen = false;

        // RESET
        this.newSection = {
          name: '',
          mode: 'api',
          categories: [],
          openDropdown: false
        };

        this.searchQuery = '';
        this.searchResults = [];
        this.openGameDropdown = false;

        this.loadSections();
      },

      error: (err) => {
        console.error(err);
      }
    });
}
  // ✅ ADD THIS
  get paginatedCategories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.categories.slice(start, start + this.itemsPerPage);
  }
  addGameToSection(game: any) {

  const exists = this.newSection.categories.find(
    (x: any) => x._id === game._id
  );

  if (exists) return;

  this.newSection.categories.push(game);

  this.searchQuery = '';

  this.searchResults = [];

  this.openGameDropdown = false;

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

  console.log('📤 LOADING BANNERS:', section);

  this.bannerService.getBanners(section).subscribe({

    next: (res: any) => {

      console.log('📥 BANNERS RESPONSE:', res);

      const data = Array.isArray(res)
        ? res
        : (res.data || []);

      this.banners = data.map((b: any) => ({
        ...b,
        selectedDevice: 'desktop'
      }));
    },

    error: (err) => {
      console.error('❌ BANNER LOAD ERROR:', err);
    }
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

  formData.append('link', this.draftBanner.link || '');

  formData.append(
    'section',
    this.sectionMap[this.selectedOption]
  );

  console.log('📤 CREATING BANNER...');

  this.bannerService.createBanner(formData).subscribe({

    next: (res) => {

      console.log('✅ BANNER CREATED:', res);

      this.isAddingBanner = false;

      this.draftBanner = {
        link: '',
        desktopImage: null,
        mobileImage: null,
        desktopPreview: null,
        mobilePreview: null,
      };

      this.loadBanners();
    },

    error: (err) => {

      console.error('❌ CREATE BANNER ERROR:', err);

      alert(
        err?.error?.message ||
        'Banner create failed'
      );
    }
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
