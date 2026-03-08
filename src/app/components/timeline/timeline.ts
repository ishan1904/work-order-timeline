import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../services/data';
import { WorkCenterDocument, WorkOrderDocument } from '../../models/docs';
import { OrderPanelComponent } from '../order-panel/order-panel';

type ZoomLevel = 'day' | 'week' | 'month';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, OrderPanelComponent],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  workCenters: WorkCenterDocument[] = [];
  orders: WorkOrderDocument[] = [];

  zoom: ZoomLevel = 'day';
  pxPerDay = 60;
  totalDays = 60;

  panelOpen = false;
  editingOrder: WorkOrderDocument | null = null;
  activeMenuOrderId: string | null = null;

  // timeline range start (today - 14 days)
  timelineStart: Date = new Date();

  constructor(private dataService: DataService) {
    this.workCenters = this.dataService.getWorkCenters();

    this.dataService.workOrders$.subscribe((o: WorkOrderDocument[]) => {
      this.orders = o;
  });

    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    this.timelineStart = start;
  }

  setZoom(level: ZoomLevel) {
  this.zoom = level;

  if (level === 'day') {
    this.pxPerDay = 60;
    this.totalDays = 60; 
  }

  if (level === 'week') {
    this.pxPerDay = 18;
    this.totalDays = 120; 
  }

  if (level === 'month') {
    this.pxPerDay = 6;
    this.totalDays = 365; 
  }
}

  iso(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  headerLabel(d: Date): string {
    if (this.zoom === 'day') {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(d);
    }

    if (this.zoom === 'week') {
      const idx = this.diffDays(d);
      if (idx % 7 !== 0) return '';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(d);
    }

    if (d.getDate() !== 1) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(d);
  }

  openCreate(workCenterId: string, startDate: string) {
    this.editingOrder = {
      docId: '',
      docType: 'workOrder',
      data: {
        name: '',
        workCenterId,
        status: 'open',
        startDate,
        endDate: startDate,
      },
    };
    this.panelOpen = true;
  }

  openEdit(order: WorkOrderDocument) {
  this.editingOrder = JSON.parse(JSON.stringify(order));
  this.panelOpen = true;
  this.closeMenu();
}

  closePanel() {
  this.panelOpen = false;
  this.editingOrder = null;
  this.orders = this.dataService.getCurrentOrders();
}
  toggleMenu(orderId: string, event: MouseEvent) {
  event.stopPropagation();
  this.activeMenuOrderId = this.activeMenuOrderId === orderId ? null : orderId;
}

closeMenu() {
  this.activeMenuOrderId = null;
}

deleteOrder(order: WorkOrderDocument, event?: MouseEvent) {
  if (event) {
    event.stopPropagation();
  }
  this.dataService.deleteOrder(order.docId);
  this.orders = this.dataService.getCurrentOrders();
  this.closeMenu();
}

openEditFromMenu(order: WorkOrderDocument, event: MouseEvent) {
  event.stopPropagation();
  this.openEdit(order);
  this.closeMenu();
}

  ordersForWorkCenter(wcId: string): WorkOrderDocument[] {
    return this.orders.filter(o => o.data.workCenterId === wcId);
  }

  get days(): Date[] {
    const arr: Date[] = [];
    for (let i = 0; i < this.totalDays; i++) {
      const d = new Date(this.timelineStart);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }

  toDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

  diffDays(d: Date): number {
      const msPerDay = 1000 * 60 * 60 * 24;

      const utcA = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
      const utcB = Date.UTC(
        this.timelineStart.getFullYear(),
        this.timelineStart.getMonth(),
        this.timelineStart.getDate()
      );

      return Math.round((utcA - utcB) / msPerDay);
    }

  barStyle(order: WorkOrderDocument) {
    const start = this.toDate(order.data.startDate);
    const end = this.toDate(order.data.endDate);

    const leftDays = this.diffDays(start);
    const rightDays = this.diffDays(end);

    const leftPx = leftDays * this.pxPerDay;
    const widthPx = Math.max(this.pxPerDay, (rightDays - leftDays + 1) * this.pxPerDay);
    
    return {
      left: `${leftPx}px`,
      width: `${widthPx}px`,
    };
  }

  statusClass(order: WorkOrderDocument): string {
    return `status-${order.data.status}`;
  }

  todayLeftPx(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.diffDays(today) * this.pxPerDay;
  }

  generate1000() {
  this.dataService.generateOrders(1000);
  this.closeMenu();
}

resetOrders() {
  this.dataService.resetOrders();
  this.closeMenu();
}
  
}