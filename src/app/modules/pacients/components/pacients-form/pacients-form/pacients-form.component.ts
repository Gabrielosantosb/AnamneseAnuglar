import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {PacientsEvent} from "../../../../../../models/interfaces/enums/pacients/PacientEvent";
import {EditPacientAction} from "../../../../../../models/interfaces/pacients/event/editPacient";
import {ToastMessage} from "../../../../../services/toast-message/toast-message";
import {ConfirmationModal} from "../../../../../services/confirmation/confirmation-service.service";
import {PacientService} from "../../../../../services/pacients/pacients.service";
import {ProgressBar, ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'app-pacients-form',
  templateUrl: './pacients-form.component.html',
  styleUrls: ['./pacients-form.component.scss'],
  providers: [ToastMessage, ConfirmationModal]
})
export class PacientsFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  isLoading = false
  loadingMode: ProgressBarModule = 'indeterminate';

  public addPacientAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editPacientAction = PacientsEvent.EDIT_PACIENT_ACTION;

  public pacientAction!: { event: EditPacientAction };
  public pacientForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    uf: ['', Validators.required],
    phone: ['', Validators.required],
    birth: ['', [Validators.required, this.dateValidator]],

    gender: ['', Validators.required],
    profession: ['', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private pacientService: PacientService,
    private confirmationModal: ConfirmationModal,
    private toastMessage: ToastMessage
  ) {}

  ngOnInit(): void {
    this.pacientAction = this.ref.data;

    if (
      (this.pacientAction?.event?.action === this.editPacientAction && this.pacientAction?.event?.categoryName !== null) || undefined)
      this.setPacientName(this.pacientAction?.event?.categoryName as string);

  }

  dateValidator(control :AbstractControl) {
    const dateString = control.value;
    if (dateString) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato yyyy-mm-dd
      if (!dateRegex.test(dateString)) {
        return { invalidFormat: true };
      }
    }
    return null;
  }

  handleSubmitPacientAction(): void {
    if (this.pacientAction?.event?.action === this.addPacientAction) this.handleSubmitAddPacient();
    if (this.pacientAction?.event?.action === this.editPacientAction) this.handleSubmitEditCategory();
    return;
  }

  handleSubmitAddPacient(): void {
    if (this.pacientForm?.value && this.pacientForm?.valid) {
      this.isLoading = true
      const requestCreateCategory: { username: string, email: string, address: string, uf: string, phone: string, birth: string, gender: string, profession: string } = {
        username: this.pacientForm.value.name as string,
        email: this.pacientForm.value.email as string,
        address: this.pacientForm.value.address as string,
        uf: this.pacientForm.value.uf as string,
        phone: this.pacientForm.value.phone as string,
        profession: this.pacientForm.value.profession as string,
        birth: this.pacientForm.value.birth as string,
        gender: this.pacientForm.value.gender as string,
      };

      this.pacientService
        .createPacient(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response:any) => {
            if (response) {
              this.pacientForm.reset();
              this.toastMessage.SuccessMessage('Paciente criado com sucesso!')
              this.isLoading = false
            }
          },
          error: (err: any) => {
            console.log(err);
            this.pacientForm.reset();
            this.toastMessage.ErrorMessage('Erro ao criar Paciente!')
          },
        });
    }
  }

  handleSubmitEditCategory(): void {
    if (
      this.pacientForm?.value &&
      this.pacientForm?.valid &&
      this.pacientAction?.event?.id
    ) {
      const requestEditCategory: { name: string; category_id: number } = {
        name: this.pacientForm?.value?.name as string,
        category_id: this.pacientAction?.event?.id,
      };

      this.pacientService
        .editCategory(requestEditCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.pacientForm.reset();
            this.toastMessage.SuccessMessage('Paciente editada com sucesso!')
          },
          error: (err: any) => {
            console.log(err);
            this.pacientForm.reset();
            this.toastMessage.ErrorMessage('Erro ao editar Paciente!')
          },
        });
    }
  }

  setPacientName(categoryName: string): void {
    if (categoryName) {
      const formValues = {
        name: this.pacientForm.value.name || '',
        email: this.pacientForm.value.email || '',
        address: this.pacientForm.value.address || '',
        uf: this.pacientForm.value.uf || '',
        phone: this.pacientForm.value.phone|| '',
        birth: this.pacientForm.value.birth || '',
        gender: this.pacientForm.value.gender|| '',
        profession: this.pacientForm.value.profession|| '',
      };
      this.pacientForm.setValue(formValues);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
