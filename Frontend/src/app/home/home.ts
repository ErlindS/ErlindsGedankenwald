import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { PostCard } from '../post-card/post-card';

@Component({
    selector: 'app-home',
    imports: [Hero, PostCard],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home { }
