import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @ViewChild('progressBar') progressBarRef!: ElementRef;
  progressBar!: HTMLDivElement;
  @Input() title!: string;
  constructor(
    
  ) { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.progressBar = this.progressBarRef.nativeElement;
  }
  changeProgressBarValue(num: number){
    this.progressBar.setAttribute('aria-valuenow', num.toString());
    this.progressBar.setAttribute('style',`width: ${num.toString()}%`)
  }
  ngOnDestroy() {
  }

}
