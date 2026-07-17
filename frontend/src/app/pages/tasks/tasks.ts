import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task, TaskPriority } from '../../services/task';
import { Auth } from '../../services/auth';

type FilterMode = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  tasks = signal<Task[]>([]);
  errorMessage = signal('');

  // add-task form fields
  newTitle = '';
  newDescription = '';
  newDueDate = '';
  newPriority: TaskPriority = 'medium';

  // edit state
  editingTaskId = signal<string | null>(null);
  editTitle = '';
  editDescription = '';
  editDueDate = '';
  editPriority: TaskPriority = 'medium';

  // search & filter state
  searchTerm = signal('');
  filterMode = signal<FilterMode>('all');

  // derived list: search + filter applied, computed automatically when
  // tasks(), searchTerm(), or filterMode() change
  visibleTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const mode = this.filterMode();

    return this.tasks().filter((task) => {
      const matchesSearch =
        !term ||
        task.title.toLowerCase().includes(term) ||
        (task.description || '').toLowerCase().includes(term);

      const matchesFilter =
        mode === 'all' ||
        (mode === 'active' && !task.completed) ||
        (mode === 'completed' && !!task.completed);

      return matchesSearch && matchesFilter;
    });
  });

  activeCount = computed(() => this.tasks().filter((t) => !t.completed).length);

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

  setFilter(mode: FilterMode) {
    this.filterMode.set(mode);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date(new Date().toDateString());
  }

  addTask() {
    if (!this.newTitle.trim()) return;

    this.taskService
      .createTask({
        title: this.newTitle,
        description: this.newDescription,
        dueDate: this.newDueDate || null,
        priority: this.newPriority,
      })
      .subscribe({
        next: (task) => {
          this.tasks.set([task, ...this.tasks()]);
          this.newTitle = '';
          this.newDescription = '';
          this.newDueDate = '';
          this.newPriority = 'medium';
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
    this.editDueDate = task.dueDate ? task.dueDate.substring(0, 10) : '';
    this.editPriority = task.priority || 'medium';
  }

  cancelEdit() {
    this.editingTaskId.set(null);
  }

  saveEdit(task: Task) {
    this.taskService
      .updateTask(task._id!, {
        title: this.editTitle,
        description: this.editDescription,
        dueDate: this.editDueDate || null,
        priority: this.editPriority,
      })
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