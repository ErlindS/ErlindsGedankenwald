import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostCard } from './post-card/post-card'
import { Header } from './header/header';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
            PostCard,
            Header
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');
}
