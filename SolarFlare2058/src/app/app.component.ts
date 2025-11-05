import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { InstructionsComponent } from './instructions/instructions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgIf, NgClass, LeaderboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentScore = 0;
  gameBoard: number[] = [0, 2, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 2,
    0, 0, 0, 0];
  readonly dialog = inject(MatDialog);

  openLeaderboardDialog() {
    this.dialog.open(LeaderboardComponent);
  }

  openHowToPlayDialog() {
    this.dialog.open(InstructionsComponent);
  }
}
