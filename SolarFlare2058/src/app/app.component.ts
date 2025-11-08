import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { InstructionsComponent } from './instructions/instructions.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgIf, NgClass, LeaderboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentScore: number = 0;
  gameId = 0;
  gameBoard: number[] = [0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0];
  readonly dialog = inject(MatDialog);

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.startGameOnLoad();
  }

  startGameOnLoad(): void {
    // TODO: remove the hardcoded localhost here
    this.http
      .post('http://localhost:3000/api/game/start', {})
      .subscribe({
        next: (response: any) => {
          this.gameId = response.game.gameId;
          this.gameBoard = response.game.gameBoard;
        },
        error: (err) => {
          console.error('Error starting game:', err);
        }
      })
  }

  openLeaderboardDialog() {
    this.dialog.open(LeaderboardComponent);
  }

  openHowToPlayDialog() {
    this.dialog.open(InstructionsComponent);
  }
}
