import { Article, articles, Vote, votes, Website, websites } from './model';
import { context, ContractPromiseBatch, PersistentVector, u128 } from "near-sdk-as";


const STORAGE_COST = u128.from('100000000000000000000');
const MAX_URL_LEN = 255;
const MAX_TITLE_LEN = 255;
const MAX_SUMMARY_LEN = 1023;

export function addArticle(websiteName: string, websiteLogo: string = "", url: string, title: string, image_url: string, summary: string, language: string, publishedDate: number): Article {
  assert(context.attachedDeposit >= STORAGE_COST, "Minimum tip is " + STORAGE_COST.toString());
  assert(websiteLogo.length <= MAX_URL_LEN, "Max URL length is " + MAX_URL_LEN);
  assert(url.length <= MAX_URL_LEN, "Max URL length is " + MAX_URL_LEN);
  assert(title.length <= MAX_URL_LEN, "Max title length is " + MAX_TITLE_LEN);
  assert(title.summary <= MAX_SUMMARY_LEN, "Max title length is " + MAX_TITLE_LEN);
  let website = getWebsite(websiteName);
  if (!website){
    website = addWebsite(websiteName, websiteLogo);
  }

  let n = new Article(url, title, image_url, summary, language, publishedDate, website);
  articles.add(n);
  return n;
}

export function getArticlesReverse(elements: number=10, offset: number=0): Article[] | null{
  assert(articles != null, "Article hasn't been initilized yet");
  
  let retArticle = new Array<Article>();
  for (let i = offset * elements; i < (offset * elements + elements) && i < articles.length; i++){
    retArticle.push(articles[i as i32]);
  }
  return retArticle;
}

export function getArticles(elements: number=10, offset: number=0): Article[] | null{
  assert(articles != null, "Article hasn't been initilized yet");
  
  let retArticle = new Array<Article>();
  for (let i = (offset * elements + elements); i > (offset * elements - elements) && i >= 0; i--){
    retArticle.push(articles[i as i32]);
  }
  return retArticle;
}

export function getArticle(url: string): Article | null {
  let retArticle = null;
  for (let i = 0; i < articles.length; i++){
    if(articles[i as i32].url == url){
      return articles[i as i32];
    }
  }
  assert(retArticle != null, "Article " + url + "doesn't exist");
  return retArticle;
}

// TODO
function _setArticle(url: string){
  
}

export function getWebsite(websiteName: string): Website {
  return websites.get(websiteName);
}

export function addWebsite(websiteName: string, websiteLogo: string): Website {
  let website = new Website(websiteName, websiteLogo);
  websites.set(websiteName, website);
  return website;
}

export function hasVoted(url: string, user: string): boolean {
  let article = getArticle(url);

  let hasVoted = false;
  for (let i = 0; i < article.votes.length; i++){
    if(article.votes[i as i32].owner == user){
      hasVoted = true;
      break;
    }
  }

  return hasVoted;
}

export function voteArticle(url: string, upvote: boolean): void{
  assert(hasVoted(url, context.sender) == false, "User " + context.sender + " has already voted for article " + url);
  let article = getArticle(url);
  let vote = new Vote(upvote);
  article.votes.add(vote);
  if(upvote){
    article.upvote++;
  }
  else{
    article.downvote--;
  }

  _setArticle(url, article);
}
