import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostCard } from './post-card/post-card';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal("Erlind's Gedankenwald");
}
