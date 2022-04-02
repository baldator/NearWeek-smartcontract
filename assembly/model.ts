import { context, PersistentMap, PersistentVector } from "near-sdk-as";

const initDate = 1640995200000000000;

/** 
 * Exporting a new class Website so it can be used outside of this file.
 */
 @nearBindgen
 export class Website {
   constructor(public name: string, public logo: string) {
     this.name = name;
     this.logo = logo;
  }
 }
 

/** 
 * Exporting a new class Article so it can be used outside of this file.
 */
@nearBindgen
export class Article {
  website: Website;
  owner: string;
  votes: PersistentVector<Vote>;
  endtime: number;
  upvote: number;
  downvote: number;
  constructor(public url: string, public title: string, public image: string, public summary: string, public language: string, public publishedDate: number, website: Website, duration: number) {
    this.url = url;
    this.title = title;
    this.image = image;
    this.summary = summary;
    this.language = language;
    this.publishedDate = publishedDate;
    this.owner = context.sender;
    this.website = website;
    this.votes = new PersistentVector<Vote>(url);
    this.endtime = u32((duration + context.blockTimestamp - initDate) / 10 ** 9);
    this.upvote = 0;
    this.downvote = 0;
  }
}

/** 
 * Exporting a new class Comment so it can be used outside of this file.
 */
 @nearBindgen
 export class Vote {
  downvote: number;
  owner: string;
  constructor(public upvote: boolean) {
    this.upvote = upvote;
    this.owner = context.sender;
  }
 }
 
 

/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const votes = new PersistentMap<string, Vote>("");
export const article = new PersistentVector<Article>("a");
export const websites = new PersistentMap<string, Website>("w");