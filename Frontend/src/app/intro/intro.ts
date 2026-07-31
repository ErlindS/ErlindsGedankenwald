import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface TreeConfig {
  id: number;
  height: number;
  delay: string;
  flyTransform: string;
}

interface TreeLayerOptions {
  minHeight: number;
  maxHeight: number;
  staggerBase: number;
  flyXFactor: number;
  flyY: number;
  flyScale: number;
}

const TITLE = 'Erlinds Gedankenwald';
const BACK_TREE_COUNT = 13;
const FRONT_TREE_COUNT = 7;
const PARTICLE_COUNT = 26;

function buildTrees(count: number, opts: TreeLayerOptions): TreeConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const leftPercent = ((i + 0.5) / count) * 100;
    const offsetFromCenter = leftPercent - 50;
    const flyX = Math.round(offsetFromCenter * opts.flyXFactor);
    return {
      id: i,
      height: opts.minHeight + Math.round(Math.random() * (opts.maxHeight - opts.minHeight)),
      delay: (i * opts.staggerBase + Math.random() * 0.1).toFixed(2),
      flyTransform: `translate(${flyX}px, ${opts.flyY}%) scale(${opts.flyScale})`,
    };
  });
}

@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly showIntro = signal(true);
  protected readonly isLeaving = signal(false);

  protected readonly titleLetters = TITLE.split('').map((char) => (char === ' ' ? ' ' : char));

  protected readonly backTrees = buildTrees(BACK_TREE_COUNT, {
    minHeight: 40,
    maxHeight: 75,
    staggerBase: 0.045,
    flyXFactor: 5,
    flyY: -14,
    flyScale: 1.35,
  });

  protected readonly frontTrees = buildTrees(FRONT_TREE_COUNT, {
    minHeight: 95,
    maxHeight: 165,
    staggerBase: 0.07,
    flyXFactor: 17,
    flyY: 18,
    flyScale: 2.3,
  });

  protected readonly particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2.4,
    duration: 3 + Math.random() * 3.5,
    size: 3 + Math.random() * 6,
  }));

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.showIntro.set(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.showIntro.set(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    setTimeout(() => this.isLeaving.set(true), 2700);
    setTimeout(() => {
      this.showIntro.set(false);
      document.body.style.overflow = previousOverflow;
    }, 4400);
  }
}
