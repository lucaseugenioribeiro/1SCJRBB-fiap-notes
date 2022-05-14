import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Note } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css'],
})
export class FormNoteComponent implements OnInit {
  title = 'FIAP NOTES';
  logoImage = '/assets/logo.png';

  checkoutForm: FormGroup;

  subscriptionEditNote: Subscription;

  idNoteUptade: number = 0;
  
  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {
  
    this.subscriptionEditNote = this.noteService.editNoteProvider.subscribe({
      next: (note: Note) => {
        this.idNoteUptade = note.id;
        this.checkoutForm.setValue({
          textNote: note.text
        })
      },
      error: () => {}
    });

    this.checkoutForm = this.formBuilder.group({
      textNote: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {}

  sendNote() {
    if(this.idNoteUptade){
      this.updateNote();
    }
    else {
      this.createNote();
    }
  }

  createNote() {
    // console.log(this.checkoutForm.get('textNote')?.errors);
    if (this.checkoutForm.valid) {
      this.noteService.postNotes(this.checkoutForm.value.textNote).subscribe({
        //next é chamado quando as coisas dão certo
        next: (note) => this.success(note),
        //error é chamado no caso de excessões
        error: (error) => alert("Algo errado na inserção! " + error)
      });
    }
  }

  updateNote() {
    // console.log(this.checkoutForm.get('textNote')?.errors);
    if (this.checkoutForm.valid) {
      this.noteService.putNotes(this.idNoteUptade, this.checkoutForm.value.textNote).subscribe({
        //next é chamado quando as coisas dão certo
        next: (note) => this.success(note),
        //error é chamado no caso de excessões
        error: (error) => alert("Algo errado na inserção! " + error)
      });
    }
  }

  success(note: Note){
    this.resetForm();
    this.noteService.notifyRefreshList(note);
  }

  resetForm() {
    this.idNoteUptade = 0;
    this.checkoutForm.reset();
  }

  get textNote() {
    return this.checkoutForm.get('textNote');
  }
}
