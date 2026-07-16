import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  tasks = signal<Task[]>([]);
  newTitle = '';
  newDescription = '';
  errorMessage = signal('');
  editingTaskId = signal<string | null>(null);
  editTitle = '';
  editDescription = '';

  constructor(
    private taskService: TaskService,
    public auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: () => this.errorMessage.set('Failed to load tasks'),
    });
  }

  addTask() {
    if (!this.newTitle.trim()) return;

    this.taskService
      .createTask({ title: this.newTitle, description: this.newDescription })
      .subscribe({
        next: (task) => {
          this.tasks.set([task, ...this.tasks()]);
          this.newTitle = '';
          this.newDescription = '';
        },
        error: () => this.errorMessage.set('Failed to create task'),
      });
  }

  toggleComplete(task: Task) {
    this.taskService.updateTask(task._id!, { completed: !task.completed }).subscribe({
      next: (updated) => {
        this.tasks.set(this.tasks().map((t) => (t._id === updated._id ? updated : t)));
      },
      error: () => this.errorMessage.set('Failed to update task'),
    });
  }

  startEdit(task: Task) {
    this.editingTaskId.set(task._id!);
    this.editTitle = task.title;
    this.editDescription = task.description || '';
  }

  cancelEdit() {
    this.editingTaskId.set(null);
  }

  saveEdit(task: Task) {
    this.taskService
      .updateTask(task._id!, { title: this.editTitle, description: this.editDescription })
      .subscribe({
        next: (updated) => {
          this.tasks.set(this.tasks().map((t) => (t._id === updated._id ? updated : t)));
          this.editingTaskId.set(null);
        },
        error: () => this.errorMessage.set('Failed to update task'),
      });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task._id!).subscribe({
      next: () => {
        this.tasks.set(this.tasks().filter((t) => t._id !== task._id));
      },
      error: () => this.errorMessage.set('Failed to delete task'),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
