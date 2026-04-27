import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

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
    private router: Router,
    private authService: AuthService
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

    this.categoryService.addCategory(this.newCategoryName).subscribe(() => {
      this.newCategoryName = '';
      this.loadCategories();
    });
  }

  deleteCategory(category: Category) {
    this.categoryService.deleteCategory(category._id!).subscribe(() => {
      this.loadCategories();
    });
  }

  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}