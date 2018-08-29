import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DecksComponent } from './decks/decks.component';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { StartComponent } from './start/start.component';
import { DecksAddComponent } from './decks-add/decks-add.component';
import { CategoryComponent } from './category/category.component';
import { QuestionAddComponent } from './question-add/question-add.component';
import { QuestionsComponent } from './questions/questions.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'decks/new',
    component: DecksAddComponent
  },
  {
    path: 'decks',
    component: DecksComponent
  },
  {
    path: 'decks/:id',
    component: DeckDetailsComponent
  },
  {
    path: 'decks/start/:id',
    component: StartComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'questions',
    component: QuestionsComponent
  },
  {
    path: 'questions/new',
    component: QuestionAddComponent
  },
  {
    path: ':category',
    component: CategoryComponent
  }


];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
