import { Component, effect, input, output, signal } from '@angular/core';
import { CategoryNode } from './category-node';

/**
 * Renders `nodes` as a horizontal tab bar with nothing selected by default.
 * Clicking a tab reveals, in order: its `children` (rendered by recursively
 * nesting this same component, giving unlimited category depth) and then its
 * own `content` text.
 *
 * Each level tracks its own `selectedIndex`. Because Angular reuses this
 * component instance when a sibling tab is picked (e.g. switching from
 * "Blog" to "Projekte" at the parent level just changes the `nodes` input on
 * the same child instance), the `effect` below resets `selectedIndex` to
 * `null` whenever `nodes` changes — otherwise a subcategory chosen under one
 * tab would still appear selected after switching to a different tab.
 *
 * `nodeSelected` fires whenever a tab in *this* instance is picked, so a
 * parent can react to the top-level selection (e.g. to hide unrelated
 * content) without needing to know about deeper levels of the tree.
 */
@Component({
  selector: 'app-category-tree',
  imports: [CategoryTree],
  templateUrl: './category-tree.html',
  styleUrl: './category-tree.scss',
})
export class CategoryTree {
  nodes = input.required<CategoryNode[]>();
  selectedIndex = signal<number | null>(null);
  nodeSelected = output<CategoryNode>();

  constructor() {
    effect(() => {
      this.nodes();
      this.selectedIndex.set(null);
    });
  }

  select(index: number): void {
    this.selectedIndex.set(index);
    this.nodeSelected.emit(this.nodes()[index]);
  }
}
