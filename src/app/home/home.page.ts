import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  selectedImage: File | null = null;
  isAdmin: boolean = false;

  constructor(private taskService: TaskService, private authService: AuthService) {}

  ngOnInit() {
    this.checkIfAdmin();
    this.loadTasks();
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
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
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

    this.taskService.addTask(this.newTaskTitle, this.selectedImage || undefined).subscribe(task => {
      this.tasks.push(task);
      this.newTaskTitle = '';
      this.selectedImage = null;
    });
  }

  changeStatus(task: Task, event: any) {
    const newStatus = event.detail.value as 'pendiente' | 'en_progreso' | 'completada';

    this.taskService.updateTask(task._id!, newStatus).subscribe(updatedTask => {
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