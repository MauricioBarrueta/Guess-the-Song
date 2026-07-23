import { Routes } from '@angular/router';
import { Main } from './features/quiz/pages/main/main';
import { Game } from './features/quiz/pages/game/game';
import { Score } from './features/quiz/pages/score/score';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: Main },
    { path: 'quiz', component: Game },
    { path: 'score', component: Score },

    { path: '**', redirectTo: '' }
];