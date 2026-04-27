import { Component, OnInit } from '@angular/core';
import { AdminService, AdminStats } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false,
})
export class AdminPage implements OnInit {

  stats: AdminStats | null = null;

  users: any[] = [];
  searchTerm: string = '';
  showBlockedOnly: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStats();
    this.loadUsers();
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  loadUsers() {
    this.adminService.getUsers(this.searchTerm, this.showBlockedOnly).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  onSearchChange() {
    this.loadUsers();
  }

  onToggleBlocked() {
    this.loadUsers();
  }

  // ================= ACCIONES =================

  unblockUser(userId: string) {
    this.adminService.unblockUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.loadStats();
      },
      error: (error) => {
        console.error('Error al desbloquear usuario:', error);
      }
    });
  }

  toggleRole(user: any) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';

    this.adminService.changeRole(user._id, newRole).subscribe({
      next: () => {
        this.loadUsers();
        this.loadStats();
      },
      error: (error) => {
        console.error('Error al cambiar rol:', error);
      }
    });
  }

  deleteUser(userId: string) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.loadStats();
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}