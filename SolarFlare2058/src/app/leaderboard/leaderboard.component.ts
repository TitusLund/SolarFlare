import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {NgFor} from '@angular/common'
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, NgFor],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})

export class LeaderboardComponent implements OnInit{
  private dialogRef = inject(MatDialogRef<LeaderboardComponent>);


  scores: { username: string; score: number }[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() : void {
    console.log("trying to load score")
      this.loadScores()
  }

    async loadScores() : Promise<void> {
      this.http.get<{username: string; score: number} []>('http://localhost:3000/api/scores/')
        .subscribe({
          next: (data) => {
            this.scores = data;
            //this.cdr.markForCheck();
            console.log(data)
          },
          error: (err) => {
            console.error('Error fetching scores:', err)
          }
        })
      }
    

  closeDialog(): void {
    this.dialogRef.close();
  }
}
