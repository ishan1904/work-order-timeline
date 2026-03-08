import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkCenterDocument, WorkOrderDocument } from '../models/docs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private storageKey = 'work-order-timeline-orders';

  private workCenters: WorkCenterDocument[] = [
    { docId: 'wc1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
    { docId: 'wc2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
    { docId: 'wc3', docType: 'workCenter', data: { name: 'Assembly Station' } },
    { docId: 'wc4', docType: 'workCenter', data: { name: 'Quality Control' } },
    { docId: 'wc5', docType: 'workCenter', data: { name: 'Packaging Line' } },
  ];

  private initialOrders: WorkOrderDocument[] = [
  {
    docId: 'wo1',
    docType: 'workOrder',
    data: {
      name: 'Order #101',
      workCenterId: 'wc1',
      status: 'complete',
      startDate: '2026-02-22',
      endDate: '2026-02-26',
    },
  },
  {
    docId: 'wo2',
    docType: 'workOrder',
    data: {
      name: 'Order #102',
      workCenterId: 'wc1',
      status: 'open',
      startDate: '2026-02-28',
      endDate: '2026-03-06',
    },
  },
  {
    docId: 'wo3',
    docType: 'workOrder',
    data: {
      name: 'Order #103',
      workCenterId: 'wc2',
      status: 'in-progress',
      startDate: '2026-03-01',
      endDate: '2026-03-06',
    },
  },
  {
    docId: 'wo4',
    docType: 'workOrder',
    data: {
      name: 'Order #104',
      workCenterId: 'wc3',
      status: 'blocked',
      startDate: '2026-02-20',
      endDate: '2026-02-24',
    },
  },
  {
    docId: 'wo5',
    docType: 'workOrder',
    data: {
      name: 'Order #105',
      workCenterId: 'wc3',
      status: 'open',
      startDate: '2026-02-26',
      endDate: '2026-03-03',
    },
  },
  {
    docId: 'wo6',
    docType: 'workOrder',
    data: {
      name: 'Order #106',
      workCenterId: 'wc4',
      status: 'complete',
      startDate: '2026-03-03',
      endDate: '2026-03-07',
    },
  },
  {
    docId: 'wo7',
    docType: 'workOrder',
    data: {
      name: 'Order #107',
      workCenterId: 'wc5',
      status: 'in-progress',
      startDate: '2026-02-24',
      endDate: '2026-03-10',
    },
  },
{
  docId: 'wo8',
  docType: 'workOrder',
  data: {
    name: 'Order #108',
    workCenterId: 'wc2',
    status: 'open',
    startDate: '2026-03-07',
    endDate: '2026-03-10',
  },
},

{
  docId: 'wo-009',
  docType: 'workOrder',
  data: {
    name: 'Batch Mixing Run',
    workCenterId: 'wc2',
    status: 'open',
    startDate: '2026-03-10',
    endDate: '2026-03-13',
  },
},
{
  docId: 'wo-010',
  docType: 'workOrder',
  data: {
    name: 'Final Assembly Prep',
    workCenterId: 'wc3',
    status: 'in-progress',
    startDate: '2026-03-14',
    endDate: '2026-03-18',
  },
},
{
  docId: 'wo-011',
  docType: 'workOrder',
  data: {
    name: 'Inspection Cycle B',
    workCenterId: 'wc4',
    status: 'complete',
    startDate: '2026-03-19',
    endDate: '2026-03-21',
  },
},
{
  docId: 'wo-012',
  docType: 'workOrder',
  data: {
    name: 'Packaging Line Changeover',
    workCenterId: 'wc5',
    status: 'blocked',
    startDate: '2026-03-22',
    endDate: '2026-03-26',
  },
},

];

private ordersSubject = new BehaviorSubject<WorkOrderDocument[]>(
  this.loadOrdersFromStorage() ?? [...this.initialOrders]
);

workOrders$ = this.ordersSubject.asObservable();


  getWorkCenters(): WorkCenterDocument[] {
    return this.workCenters;
  }

  getCurrentOrders(): WorkOrderDocument[] {
    return this.ordersSubject.value;
  }

  private genId(prefix: string) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  }

  hasOverlap(candidate: WorkOrderDocument): boolean {
    const startA = this.parseDate(candidate.data.startDate);
    const endA = this.parseDate(candidate.data.endDate);

    return this.ordersSubject.value.some(existing => {
      if (existing.data.workCenterId !== candidate.data.workCenterId) return false;
      if (existing.docId === candidate.docId) return false;

      const startB = this.parseDate(existing.data.startDate);
      const endB = this.parseDate(existing.data.endDate);

      return startA < endB && endA > startB;
    });
  }

  private loadOrdersFromStorage(): WorkOrderDocument[] | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as WorkOrderDocument[];
    } catch {
      return null;
    }
  }

  private saveOrdersToStorage(orders: WorkOrderDocument[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
  }

  upsertOrder(order: WorkOrderDocument): { ok: true } | { ok: false; error: string } {
    const start = new Date(order.data.startDate);
    const end = new Date(order.data.endDate);

    if (!(start < end)) {
      return { ok: false, error: 'Start date must be before end date.' };
    }

    if (this.hasOverlap(order)) {
      return {
        ok: false,
        error: 'This work order overlaps another order on the same work center.',
      };
    }

    const existing = this.ordersSubject.value;
    const idx = existing.findIndex(o => o.docId === order.docId);

    if (idx >= 0) {
      const copy = [...existing];
      copy[idx] = order;
      this.ordersSubject.next(copy);
      this.saveOrdersToStorage(copy);
      return { ok: true };
    }

    const nextOrders: WorkOrderDocument[] = [
      {
        ...order,
        docId: order.docId || this.genId('wo'),
        docType: 'workOrder' as const,
      },
      ...existing,
    ];

    this.ordersSubject.next(nextOrders);
    this.saveOrdersToStorage(nextOrders);

    return { ok: true };
  }
  
generateOrders(count: number) {
  const centers = this.workCenters.map(w => w.docId);
  const statuses = ['open', 'in-progress', 'complete', 'blocked'] as const;

  const newOrders: WorkOrderDocument[] = [];

  // Start from the latest end date already present on each center
  const nextAvailableByCenter: Record<string, Date> = {};

  for (const centerId of centers) {
    const existingOrdersForCenter = this.ordersSubject.value.filter(
      order => order.data.workCenterId === centerId
    );

    if (existingOrdersForCenter.length === 0) {
      const base = new Date();
      base.setHours(0, 0, 0, 0);
      nextAvailableByCenter[centerId] = base;
    } else {
      let latestEnd = new Date(existingOrdersForCenter[0].data.endDate);
      latestEnd.setHours(0, 0, 0, 0);

      for (const order of existingOrdersForCenter) {
        const end = new Date(order.data.endDate);
        end.setHours(0, 0, 0, 0);
        if (end > latestEnd) {
          latestEnd = end;
        }
      }

      nextAvailableByCenter[centerId] = latestEnd;
    }
  }

  for (let i = 0; i < count; i++) {
    const centerId = centers[i % centers.length];

    const start = new Date(nextAvailableByCenter[centerId]);

    // small gap after previous order: 1 to 2 days
    const gapDays = Math.floor(Math.random() * 2) + 1;
    start.setDate(start.getDate() + gapDays);

    // duration: 1 to 7 days
    const duration = Math.floor(Math.random() * 7) + 1;

    const end = new Date(start);
    end.setDate(end.getDate() + duration);

    newOrders.push({
      docId: this.genId('wo'),
      docType: 'workOrder',
      data: {
        name: `Auto Order ${i + 1}`,
        workCenterId: centerId,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
      },
    });

    // advance next available date for this center
    nextAvailableByCenter[centerId] = new Date(end);
  }

  const nextOrders = [...this.ordersSubject.value, ...newOrders];
  this.ordersSubject.next(nextOrders);
  this.saveOrdersToStorage(nextOrders);
}
  deleteOrder(id: string) {
  const nextOrders = this.ordersSubject.value.filter(o => o.docId !== id);
  this.ordersSubject.next(nextOrders);
  this.saveOrdersToStorage(nextOrders);
}

  resetOrders() {
  const nextOrders = [...this.initialOrders];
  this.ordersSubject.next(nextOrders);
  this.saveOrdersToStorage(nextOrders);  
}

private parseDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

}