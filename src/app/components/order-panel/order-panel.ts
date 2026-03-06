import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data';
import { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from '../../models/docs';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgbDatepickerModule],
  templateUrl: './order-panel.html',
  styleUrl: './order-panel.scss',
})
export class OrderPanelComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);

  @Input({ required: true }) order!: WorkOrderDocument;
  @Input({ required: true }) workCenters!: WorkCenterDocument[];

  @Output() close = new EventEmitter<void>();

  errorMsg = '';

  form = this.fb.group({
    name: ['', Validators.required],
    workCenterId: ['', Validators.required],
    status: ['open' as WorkOrderStatus, Validators.required],
    startDate: [null as NgbDateStruct | null, Validators.required],
    endDate: [null as NgbDateStruct | null, Validators.required],
  });

  ngOnInit() {
  this.form.patchValue({
    name: this.order.data.name,
    workCenterId: this.order.data.workCenterId,
    status: this.order.data.status,
    startDate: this.toDateStruct(this.order.data.startDate),
    endDate: this.toDateStruct(this.order.data.endDate),
  });
}

  onSave() {
    this.errorMsg = '';

    if (this.form.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }

    const v = this.form.getRawValue();

    const updated: WorkOrderDocument = {
  docId: this.order.docId,
  docType: 'workOrder',
  data: {
    name: v.name!,
    workCenterId: v.workCenterId!,
    status: v.status!,
    startDate: this.fromDateStruct(v.startDate!),
    endDate: this.fromDateStruct(v.endDate!),
  },
};

    const res = this.dataService.upsertOrder(updated);

    if (!res.ok) {
      this.errorMsg = res.error;
      return;
    }

    this.close.emit();
  }

  onDelete() {
    if (!this.order.docId) return;
    this.dataService.deleteOrder(this.order.docId);
    this.close.emit();
  }

  toDateStruct(dateString: string): NgbDateStruct | null {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

fromDateStruct(date: NgbDateStruct | null): string {
  if (!date) return '';
  const yyyy = String(date.year);
  const mm = String(date.month).padStart(2, '0');
  const dd = String(date.day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

}