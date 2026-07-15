import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-album-cover',
  imports: [],
  templateUrl: './album-cover.html'
})
export class AlbumCover {

  @Input({ required: true }) albumCover!: string
  
}
