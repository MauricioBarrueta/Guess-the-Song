import { Routes } from '@angular/router';
import { Main } from './features/quiz/pages/main/main';
import { Game } from './features/quiz/pages/game/game';
import { Score } from './features/quiz/pages/score/score';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', component: Main },
    { path: 'quiz', component: Game },
    { path: 'game-score', component: Score },

    { path: '**', redirectTo: '' }
];


/*
    export const routes: Routes = [
    { path: '', redirectTo: 'main-menu', pathMatch: 'full' },
    { path: 'main-menu', component: MainComponent },
    { path: 'main-menu/settings', component: MenuComponent },
    { path: 'game', component: GameComponent },
    { path: 'game/user-score', component: ScoreComponent },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: 'error' }
];
*/