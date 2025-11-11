import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card home-card">
      <h1>Kotaparthi Sai Gopal</h1>
      <p class="lead">Computer Science Undergraduate | Full-stack MEAN Developer</p>
      <p class="normal">A highly motivated and self-driven Computer Science undergraduate. Seeking opportunities as a fresher to apply technical skills and academic knowledge.</p>
      <p class="normal">Contact: 9398484645 • <a href="mailto:kotaparthy.gopal@gmail.com">kotaparthy.gopal@gmail.com</a></p>
    </div>
  `
})
export class HomeComponent {}
