import { Component, Input, OnInit } from '@angular/core';

interface BreadCrumbItem {
  text: string
  link?: string
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent {

  @Input('items') items: Array<BreadCrumbItem> = []

  isTheLastItem(item: BreadCrumbItem): boolean {
    return this.items.indexOf(item) + 1 === this.items.length
  }
}
