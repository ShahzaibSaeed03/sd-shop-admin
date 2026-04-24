import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BannerService } from '../../services/banner.service';
import { ProductService } from '../../services/product.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { SectionService } from '../../services/section.service';

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
  products: any[] = [];
  selectedDevice: 'desktop' | 'mobile' = 'desktop';
  selectedOption = 'Top Games';
  currentPage = 1;
  itemsPerPage = 10;


  sectionMap: any = {
    'Top Games': 'top_games',
    'Hot Selling': 'hot_selling',
    'Featured': 'featured',
    'New Releases': 'new_releases'
  };
  sections: any[] = [];
  showGameSelector = false;
  newSection: any = {
    name: '',
    mode: 'api',
    products: [],
    openDropdown: false
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
        manualProducts: s.products || []
      }));
    }
  });
}
  fetchGames() {
    if (!this.searchQuery) {
      this.searchResults = [];
      return;
    }

    this.loading = true;

    this.productService.searchGames(this.searchQuery).subscribe({
      next: (res: any) => {
        this.searchResults = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectGame(game: any) {
    const exists = this.products.find(p => p._id === game._id);

    if (exists) {
      alert('Game already added');
      return;
    }

    this.products.unshift(game); // add on top
    this.openModal = false;
  }
  // ================= NEW BANNER =================
  draftBanner: any = {
    link: '',
    desktopImage: null,
    mobileImage: null,
    desktopPreview: null,
    mobilePreview: null
  };
  // ================= UI =================
  openModal = false; // 👈 required by HTML

  // ================= OPTIONS =================
  options = [
    'Top Games',
    'Hot Selling',
    'Featured',
    'New Releases'
  ];
  // ================= VIEW =================
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;
  @ViewChild('modalDropdownWrapper') modalDropdownWrapper!: ElementRef;
  @ViewChild('modalWrapper') modalWrapper!: ElementRef;

  constructor(
    private bannerService: BannerService,
    private productService: ProductService,
    private sectionService: SectionService
  ) { }

  // ================= INIT =================
  ngOnInit() {
    this.loadBanners();
    this.loadProducts();
    this.loadSections();
  }
  setDevice(device: 'desktop' | 'mobile', banner: any) {
    banner.selectedDevice = device;
  }
  setMode(section: any, mode: 'api' | 'manual') {

    // 👉 modal case
    if (!section?._id) {
      section.mode = mode;

      // reset
      if (mode === 'api') {
        section.products = [];
      }

      return;
    }

    // 👉 existing section
    section.mode = mode;

    const payload: any = { mode };

    if (mode === 'api') {
      payload.products = [];
    }

    if (mode === 'manual') {
      payload.apiSource = null;
    }

    this.sectionService.updateSection(section._id, payload).subscribe();
  }
  openGameSelectorForNewSection() {
    this.showGameSelector = true;
  }
  addToSection(section: any, product: any) {

    const exists = section.manualProducts.find((p: any) => p._id === product._id);
    if (exists) return;

    section.manualProducts.push(product);

    const ids = section.manualProducts.map((p: any) => p._id);

    this.sectionService.updateSection(section._id, {
      products: ids
    }).subscribe({
      error: (err) => console.error(err)
    });
  }
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
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
  removeFromSection(section: any, productId: string) {

    section.manualProducts = section.manualProducts.filter(
      (p: any) => p._id !== productId
    );

    const ids = section.manualProducts.map((p: any) => p._id);

    this.sectionService.updateSection(section._id, {
      products: ids
    }).subscribe({
      error: (err) => console.error(err)
    });
  }
  updateSection(section: any) {
    this.sectionService.updateSection(section._id, {
      isActive: section.isActive
    }).subscribe({
      error: (err) => console.error(err)
    });
  }
  deleteSection(id: string) {
    if (!confirm('Delete section?')) return;

    this.sectionService.deleteSection(id).subscribe({
      next: () => this.loadSections(),
      error: (err) => console.error(err)
    });
  }
  // ================= LOAD =================
  loadBanners() {
    const section = this.sectionMap[this.selectedOption];

    this.bannerService.getBanners(section).subscribe({
      next: (res: any) => {
        this.banners = res.map((b: any) => ({
          ...b,
          selectedDevice: 'desktop' // 👈 per banner
        }));
      },
      error: (err) => console.error(err)
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => this.products = res.data, error: (err) => console.error('Product load error:', err)
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
      mobilePreview: null
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
          mobilePreview: null
        };

        this.loadBanners();
      },
      error: (err) => console.error('Create error:', err)
    });
  }

  // ================= UPDATE =================
  updateBanner(banner: any) {
    this.bannerService.updateBanner(banner._id, {
      link: banner.link
    }).subscribe({
      error: (err) => console.error('Update error:', err)
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
      error: (err) => console.error(err)
    });
  }
  // ================= DELETE =================
  deleteBanner(id: string) {
    if (!confirm('Delete banner?')) return;

    this.bannerService.deleteBanner(id).subscribe({
      next: () => this.loadBanners(),
      error: (err) => console.error('Delete error:', err)
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
      order: i
    }));

    const payload = this.banners.map(b => ({
      id: b._id,
      order: b.order
    }));

    console.log('UPDATED ORDER:', payload);

    this.bannerService.reorder(payload).subscribe({
      next: () => console.log('REORDER SUCCESS'),
      error: (err) => console.error(err)
    });
  }

  // ================= PRODUCT =================
  toggleProduct(product: any) {
    const updated = !product.isActive;

    this.productService.updateProduct(product._id, {
      isActive: updated
    }).subscribe({
      next: () => product.isActive = updated,
      error: (err) => console.error('Toggle error:', err)
    });
  }

  // ================= DROPDOWN =================
selectOption(option: string) {
  this.selectedOption = option;   // ✅ IMPORTANT
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
  removeGameFromNewSection(gameId: string) {
    this.newSection.products = this.newSection.products.filter(
      (item: any) => item._id !== gameId
    );
  }
createSection() {

  if (!this.newSection.name) {
    alert('Section name required'); // ✅ ADD THIS
    return;
  }

  if (this.newSection.mode === 'manual' && this.newSection.products.length === 0) {
    alert('Add at least 1 product');
    return;
  }

  const payload = {
  name: this.newSection.name,
  mode: this.newSection.mode,
  apiSource: this.newSection.mode === 'api' 
    ? this.sectionMap[this.selectedOption]
    : null,

  // ✅ FIX HERE
  products: this.newSection.mode === 'manual'
    ? this.newSection.products.map((p: any) => p._id)
    : [],

  isActive: true
};

console.log('PAYLOAD:', payload);

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

  addGameToSection(section: any, game: any) {

    const exists = section.manualProducts.find(
      (p: any) => p._id === game._id
    );

    if (exists) return;

    section.manualProducts.push(game);

    const ids = section.manualProducts.map((p: any) => p._id);

    this.sectionService.updateSection(section._id, {
      products: ids
    }).subscribe();

    section.openDropdown = false; // close dropdown
  }

  addGameToNewSection(game: any) {

  if (!this.newSection.products) {
    this.newSection.products = [];
  }

  const exists = this.newSection.products.find(
    (p: any) => p._id === game._id
  );

  if (exists) return;

  this.newSection.products.push(game);

  console.log('ADDED:', this.newSection.products); // 👈 DEBUG
}


}