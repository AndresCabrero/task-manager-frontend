import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../../services/category.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false,
})
export class CategoriesPage implements OnInit {

  categories: Category[] = [];
  newCategoryName: string = '';

  constructor(
    private categoryService: CategoryService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    this.categoryService.addCategory(this.newCategoryName).subscribe((category: Category) => {
      this.categories.push(category);
      this.newCategoryName = '';
    });
  }

  deleteCategory(category: Category) {
    if (!category._id) return;

    this.categoryService.deleteCategory(category._id).subscribe(() => {
      this.categories = this.categories.filter(c => c._id !== category._id);
    });
  }

  goBack() {
    this.location.back();
  }
}