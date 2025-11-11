import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding:24px; background:#fff; border-radius:8px;">
      <h2>About & Education</h2>
      <ul>
        <li>BVC College of Engineering — B.Tech Computer Science and Engineering (2022–2026 expected)</li>
        <li>Sree Vijaya Durga Junior College — Intermediate (MPC) (2020–2022)</li>
        <li>MPL Corporation High School — SSC (2019–2020)</li>
      </ul>
      <p><strong>Skills:</strong> Java, Python, HTML, Git, VS Code</p>
    </section>
  `
})
export class AboutComponent {}
