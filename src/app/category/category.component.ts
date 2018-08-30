import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Deck } from '../models/deck.model';
import { Question } from '../models/question.model';
import { QuestionService } from '../services/question.service';
import { DeckService } from '../services/deck.service';
import * as firebase from "firebase";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [
    QuestionService,
    DeckService
  ]
})
export class CategoryComponent implements OnInit {
  categoryName: string;
  categoryQuestions: Question[];
  chosenDeck: Deck;
  userDecks: Deck[];
  private user;
  categories: FirebaseListObservable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private questionService: QuestionService,
    private deckService: DeckService,
    private database: AngularFireDatabase
  ) {
    this.categories = database.list('categories');
  }

  ngDoCheck() {
    this.user = firebase.auth().currentUser;
  }

  ngOnInit() {
    if (this.user !== undefined) {
    this.userDecks = this.deckService.getDecksByUserId(this.user.userId); }
    this.route.params.subscribe(param => {

      this.categoryName = param.category;
      this.categoryQuestions = this.questionService.getQuestionsByCategory(this.categoryName, this.user);
      this.updateTitle();

    })
  }

  updateTitle() {
    this.categories.subscribe(result => {
      result.forEach(category => {
        if (this.categoryName == category.name.toLowerCase()) {
          this.categoryName = category.name;
        }
      })
    })
  }

  setChosenDeck(deck: Deck) {
    this.chosenDeck = deck;
  }

  getCategoryAndLowerCase(question: Question) {
    return question.category.toLowerCase();
  }

  getCategoryFromCategoryQuestionsAndLowerCase() {
    return this.categoryQuestions[0].category.toLowerCase();
  }

  runAddQuestionToDeck(question: Question) {
    if (this.getCategoryAndLowerCase(question) in this.chosenDeck.questions) {
      this.chosenDeck.questions[this.getCategoryAndLowerCase(question)].push(question);
    } else {
      this.chosenDeck.questions[this.getCategoryAndLowerCase(question)] = [question];
    }
    this.deckService.updateQuestionsInDeck(this.chosenDeck);
  }

  runDeleteQuestionFromDeck(question: Question) {
    let categoryArray = this.chosenDeck.questions[this.getCategoryAndLowerCase(question)];
    let indexOfQuestionToRemove = categoryArray.indexOf(question);
    this.chosenDeck.questions[this.getCategoryAndLowerCase(question)].splice(indexOfQuestionToRemove, 1);
    this.deckService.updateQuestionsInDeck(this.chosenDeck);
  }

  runAddAllQuestionsToDeck() {
    if (this.categoryQuestions[0].category.toLowerCase() in this.chosenDeck.questions) {
      this.chosenDeck.questions[this.getCategoryFromCategoryQuestionsAndLowerCase()].push(this.categoryQuestions);
    } else {
      this.chosenDeck.questions[this.getCategoryFromCategoryQuestionsAndLowerCase()] = [this.categoryQuestions];
    }
    this.deckService.updateQuestionsInDeck(this.chosenDeck);
  }

  runDeleteAllQuestionsFromDeck() {
    delete this.chosenDeck.questions[this.getCategoryFromCategoryQuestionsAndLowerCase()];
    this.deckService.updateQuestionsInDeck(this.chosenDeck);
  }
}
