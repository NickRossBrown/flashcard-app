import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Deck } from '../models/deck.model';
import { Decks } from '../models/decks.model';
import { User } from '../models/user.model';
import { DeckService } from '../services/deck.service';
import { AuthenticationService } from '../services/authentication.service';
import * as firebase from "firebase";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.css'],
  providers: [
    DeckService,
    AuthenticationService
  ]
})
export class DecksComponent implements OnInit {
  private user;
  localUser: User;
  decks: FirebaseListObservable<any[]>;
  allDecks: Deck[];
  userDeckList: Deck[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private deckService: DeckService,
    public authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.user = firebase.auth().currentUser;
    this.decks = this.deckService.getAllDecks();
    this.buildDeckList();
  }

  ngDoCheck() {
    this.user = firebase.auth().currentUser;
  }

  buildDeckList() {
    if (this.user) {
      this.authService.getUserByEmail(this.user.email);
      this.decks.subscribe((data) => {
        this.allDecks = data;
        this.buildUserDeckList();
      });
    }
  }

  buildUserDeckList() {
    this.allDecks.forEach((deck) => {
      if (deck.userEmail === this.user.email) {
        console.log('found Deck for ' + this.user.email);
        this.userDeckList.push(deck);
      }
    });
  }

  goToDeckDetail(deck) {
    this.router.navigate(['decks/', deck.$key]);
  }

  runQuiz(deck) {
    this.checkDeckForQuestions(deck);
    this.router.navigate(['decks/quiz/', deck.$key]);
  }

  checkDeckForQuestions(deck: Deck) {
    //if (deck.questions > 0)
  }

  runDeleteDeck(deck: Deck) {
    this.deckService.deleteDeck(deck);
    this.deleteFromDeckList(deck);
  }

  deleteFromDeckList(deck: Deck) {
    let deckPosition = this.userDeckList.indexOf(deck);
    this.userDeckList.splice(deckPosition, 1);
  }
}
