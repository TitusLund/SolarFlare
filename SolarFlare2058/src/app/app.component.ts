import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { InstructionsComponent } from './instructions/instructions.component';
import { GameOverComponent } from './game-over/game-over.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgIf, NgClass, LeaderboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isGameOverOpen: boolean = false;
  currentScore: number = 0;
  gameId = 0;
  gameBoard: number[] = [0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0];


  private touchStartX = 0;
  private touchStartY = 0;

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.startGameOnLoad();
  }

  startGameOnLoad(): void {
    // TODO: remove the hardcoded localhost here
    this.http
      .post('http://localhost:3000/api/game/start', {})
      .subscribe({
        next: (response: any) => {
          this.gameId = response.game.id;
          this.gameBoard = response.game.gameBoard;
          this.currentScore = 0;
        },
        error: (err) => {
          console.error('Error starting game:', err);
        }
      })
  }

  // Keyboard controls (arrows or WASD)
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const keyMap: Record<string, string> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    };

    const direction = keyMap[event.key];
    if (direction) {
      event.preventDefault(); // Disable scroll
      this.makeMove(direction);
    }
  }

  // Touch start
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  // Touch end (detect swipe direction)
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;

    // Ignore small swipes
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    let direction: string;
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }

    event.preventDefault(); // Disable scroll
    this.makeMove(direction);
  }

  // Trigger backend move request
  makeMove(direction: string): void {
    if (!this.gameId) return;
    if (this.isGameOverOpen) return;

    this.http
      .post('http://localhost:3000/api/game/shift', {
        gameId: this.gameId,
        direction: direction,
      })
      .subscribe({
        next: (response: any) => {
          this.gameBoard = response.game.gameBoard;
          this.currentScore = response.game.score;

          if (response.game.status === "gameover") {
            this.openGameOverDialog();
            console.log(response)
          }
        },
        error: (err) => {
          console.error('Error shifting pieces:', err);
        },
      });
  }

  openGameOverDialog() {
    if (this.isGameOverOpen) return;
    this.isGameOverOpen = true;


    const dialogRef = this.dialog.open(GameOverComponent);
    dialogRef.componentInstance.setScore(this.currentScore);
    dialogRef.afterClosed().subscribe(result => {
      if (result?.restart) {
        this.isGameOverOpen = false;
        this.startGameOnLoad();
        this.currentScore = 0;
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




