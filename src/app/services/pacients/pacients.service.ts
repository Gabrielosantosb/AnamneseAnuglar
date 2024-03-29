import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../environments/environments";
import {Observable, tap} from "rxjs";
import {
  AddPacientRequest,
  EditPacientRequest,
  GetPacientsResponse,

} from "../../../models/interfaces/pacients/get-pacient-service.service";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class PacientService {
  private API_URL = environments.API_URL;
  private readonly USER_AUTH = environments.COOKIES_VALUE.user_auth
  private token = this.cookie.get(this.USER_AUTH)
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    })
  }

  constructor(private http: HttpClient, private cookie: CookieService) {}


  getAllPacients(): Observable<Array<GetPacientsResponse>> {
    return this.http.get<Array<GetPacientsResponse>>(
      `${this.API_URL}/api/Pacient/get-pacients`,
      this.httpOptions
    )
  }

  getProfissionalPacients(): Observable<Array<GetPacientsResponse>> {
    return this.http.get<Array<GetPacientsResponse>>(
      `${this.API_URL}/api/Pacient/get-profissional-pacient`,
      this.httpOptions
    )
  }

  getPacientById(pacientId: number, pacientForm: FormGroup): Observable<GetPacientsResponse> {
    return this.http.get<GetPacientsResponse>(
      `${this.API_URL}/api/Pacient/get-pacient/${pacientId}`
    ).pipe(
      tap((pacientData: GetPacientsResponse) => {
        pacientForm.setValue({
          username: pacientData.username,
          email: pacientData.email,
          address: pacientData.address,
          uf: pacientData.uf,
          phone: pacientData.phone,
          birth: pacientData.birth,
          gender: pacientData.gender,
          profession: pacientData.profession
        });
      })
    );
  }

  createPacient(requestData : AddPacientRequest): Observable<Array<GetPacientsResponse>> {
      console.log('Request:', requestData)
    return this.http.post<Array<GetPacientsResponse>>(
      `${this.API_URL}/api/Pacient/create-pacient`,
      requestData,
      this.httpOptions
    );
  }

  editPacient(requestData: EditPacientRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/api/Pacient/update-pacient/${requestData.pacient_id}`,
      requestData,
      this.httpOptions
    );
  }


  deletePacient(requestData: { pacient_id: number }): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/api/Pacient/remove-pacient/${requestData.pacient_id}`,
      this.httpOptions
    );
  }

  countAllPacients () : Observable<number>
  {
    return this.http.get<number>(`${this.API_URL}/api/Pacient/count-pacients`,
      this.httpOptions)
  }
  countProfissionalPacients () : Observable<number>
  {
    return this.http.get<number>(`${this.API_URL}/api/Pacient/count-profissional`,
      this.httpOptions)
  }
}
