import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section style="padding:24px; background:#fff; border-radius:8px;">
      <h2>Contact</h2>
      <form (ngSubmit)="submit()" style="display:flex; flex-direction:column; gap:8px; max-width:480px;">
        <input name="name" [(ngModel)]="name" placeholder="Name" required />
        <input name="email" [(ngModel)]="email" placeholder="Email" required type="email" />
        <textarea name="message" [(ngModel)]="message" placeholder="Message" required rows="5"></textarea>
        <button type="submit" [disabled]="sending">Send</button>
      </form>
      <div *ngIf="success" style="color:green; margin-top:8px">{{success}}</div>
      <div *ngIf="error" style="color:red; margin-top:8px">{{error}}</div>
    </section>
  `
})
export class ContactComponent {
  name = ''; email = ''; message = '';
  sending = false; success = ''; error = '';
  private http = inject(HttpClient);

  submit() {
    this.sending = true; this.success = this.error = '';
    this.http.post('/api/contact', { name: this.name, email: this.email, message: this.message }).subscribe({
      next: () => { this.success = 'Message sent'; this.sending=false; this.name=this.email=this.message=''; },
      error: () => { this.error = 'Send failed'; this.sending=false; }
    });
  }
}
