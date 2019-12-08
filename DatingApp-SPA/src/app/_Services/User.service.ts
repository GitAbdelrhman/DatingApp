import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { User } from '../_Models/User';
import { paginationResult } from '../_Models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_Models/Message';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  getUsers(page?, itemPerPage?, userParams?, likesParam?): Observable<paginationResult<User[]>> {
    const paginatedResult: paginationResult<User[]> = new paginationResult<User[]>();
    let params = new HttpParams();
    if (page != null && itemPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (likesParam === 'likers') {
      params = params.append('likers', 'true');
    }
    if (likesParam === 'likees') {
      params = params.append('likees', 'true');
    }
    return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('pagination'))
          }
          return paginatedResult;
        })
      );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }
  SetPhotoMain(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/SetMain', {});
  }
  deletePhto(userId: number, PhotoId: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + PhotoId, {});
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?, itemPerPage?, messageContainer?) {
    const paginatedResult: paginationResult<Message[]> = new paginationResult<Message[]>();
    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);
    if (page != null && itemPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', { observe: 'response', params }).pipe(
      map(Response => {
        paginatedResult.result = Response.body;
        if (Response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(Response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getMessagesThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }
  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(userId: number, Id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + Id, {});
  }
  markAsRead(userId: number, messageId: number) {
    this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
  }
}
