import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  Link,
  List,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  Base64UploadAdapter
} from 'ckeditor5';

import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-game-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule
  ],
  templateUrl: './game-content.html',
  styleUrl: './game-content.css',
})
export class GameContent implements OnInit {

  categories: any[] = [];

  selectedCategory: any = null;

  loading = false;

  saving = false;

  public Editor = ClassicEditor;

  // ✅ FULL WORD-LIKE EDITOR
  public config: any = {

    licenseKey: 'GPL',

    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Heading,
      Link,
      List,
      Image,
      ImageToolbar,
      ImageCaption,
      ImageStyle,
      ImageUpload,
      Base64UploadAdapter
    ],

    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'uploadImage',
      '|',
      'undo',
      'redo'
    ],

    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side'
      ]
    },

    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2'
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3'
        }
      ]
    }
  };

  constructor(
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // =========================
  // LOAD GAMES
  // =========================

  loadCategories() {

    this.loading = true;

    this.categoryService
      .getCategories()
      .subscribe({

        next: (res) => {

          this.categories = res.data || [];

          this.loading = false;

          if (this.categories.length) {
            this.selectCategory(
              this.categories[0]
            );
          }
        },

        error: () => {
          this.loading = false;
        }
      });
  }

  // =========================
  // SELECT GAME
  // =========================

  selectCategory(category: any) {

    this.selectedCategory = category;

    this.loadGameInformation(
      category._id
    );
  }

  // =========================
  // LOAD CONTENT
  // =========================

  loadGameInformation(gameId: string) {

    this.categoryService
      .getGameInformation(gameId)
      .subscribe({

        next: (res) => {

          if (
            res?.data?.gameInformation
          ) {

            this.selectedCategory.gameInformation =
              res.data.gameInformation;

          } else {

            this.selectedCategory.gameInformation = [];
          }
        },

        error: () => {

          this.selectedCategory.gameInformation = [];
        }
      });
  }

  // =========================
  // ADD SECTION
  // =========================

  addSection() {

    if (
      !this.selectedCategory.gameInformation
    ) {
      this.selectedCategory.gameInformation = [];
    }

    this.selectedCategory.gameInformation.push({

      title: '',

      content: '',

      sortOrder:
        this.selectedCategory
          .gameInformation.length + 1

    });
  }

  // =========================
  // REMOVE SECTION
  // =========================

  removeSection(index: number) {

    this.selectedCategory
      .gameInformation
      .splice(index, 1);
  }

  // =========================
  // SAVE
  // =========================
openedSection: number | null = 0;

toggleSection(index: number) {

  if (this.openedSection === index) {

    this.openedSection = null;

  } else {

    this.openedSection = index;

  }

}
  saveContent() {

    if (!this.selectedCategory) return;

    this.saving = true;

    this.categoryService
      .updateGameInformation(
        this.selectedCategory._id,
        {
          gameInformation:
            this.selectedCategory
              .gameInformation
        }
      )
      .subscribe({

        next: () => {

          this.saving = false;

          alert(
            'Game information updated successfully'
          );
        },

        error: () => {

          this.saving = false;

          alert(
            'Failed to save game information'
          );
        }
      });
  }
}