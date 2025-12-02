import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

export const getApi = <T>(
  http: HttpClient,
  endpoint: string,
  query: string = ""
): Observable<T> => {
  const url = `${endpoint}${query}`;
  return http.get<T>(url);
};


export const postApi = <B,T>(
  http: HttpClient,
  endpoint: string,
  body: B,
  query: string = ''
): Observable<T> => {
  
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  const url = `${endpoint}${query}`;

  // Make POST request
  return http.post<T>(url, body, { headers });
};

