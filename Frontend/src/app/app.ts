import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Intro } from './intro/intro';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Intro
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal("Erlind's Gedankenwald");
}
