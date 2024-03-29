import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChartData, ChartOptions } from 'chart.js';
import { PacientService } from '../../../../services/pacients/pacients.service';
import { GetPacientsResponse } from '../../../../../models/interfaces/pacients/get-pacient-service.service';
import {ReportsService} from "../../../../services/reports/reports.service";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public chartData!: ChartData;
  public chartOptions!: ChartOptions;
  public allPacients!: number;
  public allReports !: number;
  public allProfissionalPacients !:number;

  constructor(
    private pacientService: PacientService,
    private reportService : ReportsService,
    private messageService: MessageService,
    private toastMessage: ToastMessage,
    private confirmationModal: ConfirmationModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllPacients();
    this.getProfissionalPacients()
    this.getAllReport()
  }

  private getAllPacients(): void {
    this.pacientService
      .countAllPacients()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: number) => {
          this.allPacients = response;
          this.setProductsChartConfig();
        },
        (error: Error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar o total de pacientes',
            life: 2000
          });
        }
      );
  }
  private getProfissionalPacients(): void {
    this.pacientService
      .countProfissionalPacients()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: number) => {
          this.allProfissionalPacients = response;
          this.setProductsChartConfig();
        },
        (error: Error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar o total de pacientes do profissional',
            life: 2000
          });
        }
      );
  }

  private getAllReport(): void {
    this.reportService
      .countReport()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: number) => {
          this.allReports = response;
          this.setProductsChartConfig();
        },
        (error: Error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar o total de fichas',
            life: 2000
          });
        }
      );
  }

  private setProductsChartConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: ['Resultados totais'],
      datasets: [
        {
          label: 'Quantidade de pacientes',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          borderColor: documentStyle.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          data: [this.allPacients]
        },
        {
          label: 'Seus pacientes',
          backgroundColor: documentStyle.getPropertyValue('--green-400'),
          borderColor: documentStyle.getPropertyValue('--green-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--green-500'),
          data: [this.allProfissionalPacients]
        },
        {
          label: 'Quantidade de fichas',
          backgroundColor: documentStyle.getPropertyValue('--orange-400'),
          borderColor: documentStyle.getPropertyValue('--orange-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--orange-500'),
          data: [this.allReports]
        },

      ]
    };
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: this.createAxisConfig(textColorSecondary, surfaceBorder),
        y: this.createAxisConfig(textColorSecondary, surfaceBorder)
      }
    };
  }

  private createAxisConfig(tickColor: string, gridColor: string) {
    return { ticks: { color: tickColor, font: { weight: 500 } }, grid: { color: gridColor } };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
