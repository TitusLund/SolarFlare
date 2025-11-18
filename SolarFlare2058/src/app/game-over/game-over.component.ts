import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [MatButtonModule, FormsModule, NgIf],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.css'
})
export class GameOverComponent {

  private dialogRef = inject(MatDialogRef<GameOverComponent>);
  private http = inject(HttpClient);

  username: string = "";
  score: number = 0;   // will be injected from parent

  // Called when opening dialog:
  setScore(score: number) {
    this.score = score;
  }

  saveScoreAndRestart() {
    if (!this.username.trim()) return;

    //TODO: this is where we need to POST the score to the DB part of C3-69
    this.http.post('http://localhost:3000/api/scores', {
      username: this.username,
      score: this.score
    }).subscribe({
      next: () => this.dialogRef.close({ restart: true }),
      error: (err) => console.error("Failed to save score:", err)
    });
  }

  closeOnly() {
    this.dialogRef.close({ restart: false });
  }
}

