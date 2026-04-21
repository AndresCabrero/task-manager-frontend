import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { CategoryService, Category } from '../services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];

  newTaskTitle: string = '';
  selectedImage: File | null = null;
  selectedCategories: string[] = [];
  isAdmin: boolean = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.checkIfAdmin();
  }

  ionViewWillEnter() {
    this.loadTasks();
    this.loadCategories();
  }

  checkIfAdmin() {
    const token = this.authService.getToken();

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = payload.role === 'admin';
    } catch (error) {
      this.isAdmin = false;
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    this.taskService.addTask(
      this.newTaskTitle,
      this.selectedCategories,
      this.selectedImage || undefined
    ).subscribe((task: Task) => {
      this.tasks.push(task);
      this.newTaskTitle = '';
      this.selectedImage = null;
      this.selectedCategories = [];
      this.loadTasks();
    });
  }

  changeStatus(task: Task, event: any) {
    const newStatus = event.detail.value as 'pendiente' | 'en_progreso' | 'completada';

    this.taskService.updateTask(task._id!, newStatus).subscribe((updatedTask: Task) => {
      task.status = updatedTask.status;
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task._id!).subscribe(() => {
      this.tasks = this.tasks.filter(t => t._id !== task._id);
    });
  }

  logout() {
    this.authService.logout();
  }
}