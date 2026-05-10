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
  isHighScore: Boolean = false;
  // Called when opening dialog:
  setScore(score: number, isHighScore: Boolean) {
    this.score = score;
    this.isHighScore = isHighScore;
    //this.isHighScore = false;
  }

  saveScoreAndRestart() {
    if (!this.username.trim()) return;

    /*
     * there is no security here. Anyone could just post this endpoint and send in a new score
     * to be saved to the database. Im not going to worry about that but if we deploy we will
     * need to fix.
     */

    this.http.post('http://app.attem.xyz/api/scores/saveScore', {
      username: this.username,
      score: this.score
    }).subscribe({
      next: () => this.dialogRef.close({ restart: true }),
      error: (err) => console.error("Failed to save score:", err)
    });
  }

  restartWithoutSave() {
    this.dialogRef.close({restart: true});
  }

  closeOnly() {
    this.dialogRef.close({ restart: false });
  }
}

