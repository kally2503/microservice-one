import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 style="margin: 24px 0 16px;">Service Dashboard</h2>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div class="card">
        <h3>Java Service</h3>
        <p *ngIf="javaHealth" [class]="javaHealth.status === 'UP' ? 'status-up' : 'status-down'">
          Status: {{ javaHealth.status }}
        </p>
        <p *ngIf="!javaHealth" class="status-down">Status: Unavailable</p>
        <p *ngIf="javaHealth">Version: {{ javaHealth.version }}</p>
      </div>

      <div class="card">
        <h3>Python Service</h3>
        <p *ngIf="pythonHealth" [class]="pythonHealth.status === 'UP' ? 'status-up' : 'status-down'">
          Status: {{ pythonHealth.status }}
        </p>
        <p *ngIf="!pythonHealth" class="status-down">Status: Unavailable</p>
        <p *ngIf="pythonHealth">Version: {{ pythonHealth.version }}</p>
      </div>
    </div>

    <div class="card" style="margin-top: 20px;" *ngIf="javaData">
      <h3>Java Service Data</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr style="border-bottom: 2px solid #eee;">
            <th style="text-align: left; padding: 8px;">ID</th>
            <th style="text-align: left; padding: 8px;">Name</th>
            <th style="text-align: left; padding: 8px;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of javaData.items" style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px;">{{ item.id }}</td>
            <td style="padding: 8px;">{{ item.name }}</td>
            <td style="padding: 8px;">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" style="margin-top: 20px;" *ngIf="pythonUsers">
      <h3>Python Service Users</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr style="border-bottom: 2px solid #eee;">
            <th style="text-align: left; padding: 8px;">ID</th>
            <th style="text-align: left; padding: 8px;">Name</th>
            <th style="text-align: left; padding: 8px;">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of pythonUsers" style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px;">{{ user.id }}</td>
            <td style="padding: 8px;">{{ user.name }}</td>
            <td style="padding: 8px;">{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  javaHealth: any = null;
  pythonHealth: any = null;
  javaData: any = null;
  pythonUsers: any[] | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getJavaHealth().subscribe({
      next: data => this.javaHealth = data,
      error: () => this.javaHealth = null
    });
    this.api.getPythonHealth().subscribe({
      next: data => this.pythonHealth = data,
      error: () => this.pythonHealth = null
    });
    this.api.getJavaData().subscribe({
      next: data => this.javaData = data,
      error: () => this.javaData = null
    });
    this.api.getPythonUsers().subscribe({
      next: data => this.pythonUsers = data,
      error: () => this.pythonUsers = null
    });
  }
}
