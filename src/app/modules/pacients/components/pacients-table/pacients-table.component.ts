import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";
import {EditPacientAction} from "../../../../../models/interfaces/pacients/event/editPacient";
import {PacientsEvent} from "../../../../../models/interfaces/enums/pacients/PacientEvent";
import {DeletePacient} from "../../../../../models/interfaces/pacients/event/deletePacient";
import {PacientService} from "../../../../services/pacients/pacients.service";
import {ReportEvent} from "../../../../../models/interfaces/enums/products/ProductEvent.js";
import {EditReportAction} from "../../../../../models/interfaces/reports/event/EditReportAction";
import {GetReportResponse} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";

@Component({
  selector: 'app-pacients-table',
  templateUrl: './pacients-table.component.html',
  styleUrls: ['./pacients-table.component.scss']
})
export class PacientsTableComponent {
  @Input() public pacients: Array<GetPacientsResponse> = [];
  @Output() public pacientEvent = new EventEmitter<EditPacientAction>();
  @Output() public deletePacientEvent = new EventEmitter<DeletePacient>();
  @Output() public reportEvent = new EventEmitter<EditReportAction>();

  public pacientSelected!: GetPacientsResponse;
  public addPacientAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editPacientAction = PacientsEvent.EDIT_PACIENT_ACTION;
  public addReportAction = ReportEvent.ADD_REPORT_EVENT;
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT;
  showProfissionalPacients = false

  constructor(private pacientService: PacientService) {
  }

  handleDeletePacientEvent(pacient_id: number, pacientName: string): void {
    if (pacient_id !== null && pacientName !== '') {
      this.deletePacientEvent.emit({pacient_id, pacientName});
    }
  }

  handleReportEvent(action: string, id?: number, pacientName?: string): void {
    if (action && action !== '')
    {
      this.reportEvent.emit({action, id, pacientName});

    }
  }
  handlePacientEvent(action: string, id?: number, pacientName?: string): void {
    if (action && action !== '') this.pacientEvent.emit({action, id, pacientName});
  }


  handleShowAllPacients(): void {
    this.pacientService.getAllPacients().subscribe({
      next: (allPacientsData) => {
        this.showProfissionalPacients = false
        this.pacients = allPacientsData;
      },
      error: (error) => {
        console.error('Erro ao obter os pacientes do usuário:', error);
      }
    });
  }
  handleProfissionalPacients(): void {
      this.pacientService.getProfissionalPacients().subscribe({
      next: (profissionalPacientsData) => {
        this.pacients = profissionalPacientsData;
      },
      error: (error) => {
        console.error('Erro ao obter os pacientes do usuário:', error);
      }
    });
  }
}
