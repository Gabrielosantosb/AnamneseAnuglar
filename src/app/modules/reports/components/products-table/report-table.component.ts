import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  GetAllProductsResponse,
  GetReportResponse
} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {ReportEvent} from "../../../../../models/interfaces/enums/products/ProductEvent.js";
import {EventAction} from "../../../../../models/interfaces/reports/event/EventAction";
import {
  DeleteReportAction
} from "../../../../../models/interfaces/reports/event/DeleteProductAction";
import {PacientService} from "../../../../services/pacients/pacients.service";
import {ReportsService} from "../../../../services/reports/reports.service";
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: []
})
export class ReportTableComponent {
  @Input() products: Array<GetAllProductsResponse> = []
  @Input() reports: Array<GetReportResponse> = [];
  @Output() reportEvent = new EventEmitter<EventAction>()
  @Output() deleteReportEvent = new EventEmitter<DeleteReportAction>()
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT
  showProfissionalReports = false
  public reportSelected!: GetReportResponse;
  constructor(private reportService: ReportsService) {
  }


  handleShowAllReports(): void {
    this.reportService.getAllReports().subscribe({
      next: (allReportData) => {
        this.showProfissionalReports = false
        this.reports = allReportData;
        console.log(this.reports)
      },
      error: (error) => {
        console.error('Erro ao obter fichas do usuário:', error);
      }
    });
  }

  handleReportEvent(action: string, reportId?: number): void {
    if (action && action !== '') this.reportEvent.emit({action, reportId})
  }

  handleDeleteReport(reportId: number, pacientName: string): void {
    if(reportId !== null && pacientName !== "")
    {
      this.deleteReportEvent.emit({
        reportId,
        pacientName,
      })
    }
  }

}
