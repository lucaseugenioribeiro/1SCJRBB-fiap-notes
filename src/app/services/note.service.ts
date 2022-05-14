import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from './@types/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl: string;

  private refreshListSource = new Subject<Note>();
  refreshListProvider = this.refreshListSource.asObservable();

  private editNoteSource = new Subject<Note>();
  editNoteProvider = this.editNoteSource.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = "https://fiap-notes-api.herokuapp.com";
  }

  private notes = [
    {
      id: 1,
      date: new Date(),
      text: 'Um texto qualquer',
      urgent: false,
    },
    {
      id: 2,
      date: new Date(),
      text: 'Um texto qualquer 2',
      urgent: true,
    },
    {
      id: 3,
      date: new Date(),
      text: 'Um texto qualquer 3',
    },
    {
      id: 4,
      date: new Date(),
      text: 'Um texto qualquer 4',
      urgent: true,
    },
  ];

  notifyRefreshList(note: Note){
    this.refreshListSource.next(note);
  }

  notifyEditNote(note: Note){
    this.editNoteSource.next(note);
    // this.newNoteSource.error("algum exception");
  }

  getNotes(){
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  removeNote(noteId: number){
    return this.http.delete(`${this.apiUrl}/notes/${noteId}`);
  }

  postNotes(textNote: string){
    return this.http.post<Note>(`${this.apiUrl}/notes`, {text: textNote});
  }

  putNotes(idNote: number, textNote: string){
    return this.http.post<Note>(`${this.apiUrl}/notes/${idNote}`, {text: textNote});
  }
  
}
