import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding: 40px 0; text-align: center;">
      <h1>Microservice Platform</h1>
      <p style="margin: 16px 0; color: #666; font-size: 18px;">
        Multi-service architecture with Java, Angular &amp; Python
      </p>
      <div style="display: flex; gap: 20px; justify-content: center; margin-top: 32px;">
        <div class="card" style="flex: 1; max-width: 300px;">
          <h3>Java Service</h3>
          <p>Spring Boot REST API running on port 8081</p>
        </div>
        <div class="card" style="flex: 1; max-width: 300px;">
          <h3>Angular App</h3>
          <p>Frontend dashboard running on port 4200</p>
        </div>
        <div class="card" style="flex: 1; max-width: 300px;">
          <h3>Python Service</h3>
          <p>Flask REST API running on port 5000</p>
        </div>
      </div>
      <a routerLink="/dashboard" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #1a1a2e; color: white; border-radius: 6px; text-decoration: none;">
        Go to Dashboard
      </a>
    </div>
  `
})
export class HomeComponent {}
