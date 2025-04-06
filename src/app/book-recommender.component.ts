import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

interface Book {
  title: string;
  cover_id: number;
  authors: { name: string }[];
}

@Component({
  selector: 'book-recommender',
  templateUrl: './book-recommender.component.html',
  styleUrls: ['./book-recommender.component.css'],
  standalone: false,
})
export class BookRecommenderComponent {
  // Some of the genres in the OpenLibrary API were throwing CORS errors, so we've got this interesting set of genres.
  protected genres = [
    'Fantasy',
    'Romance',
    'Mystery',
    'Music',
    'Science',
  ];

  protected books: Book[] = [];
  protected selectedGenre = '';
  protected loading = false;

  constructor(private http: HttpClient) {}

  protected onGenreChange() {
    // Displaying loading spinner while waiting for network request to load
    this.loading = true;
    const subject = this.selectedGenre.toLowerCase();
    const url = `https://openlibrary.org/subjects/${subject}.json?limit=10`;
    this.http.get<any>(url).subscribe((res) => {
      this.books = res.works;
      // Removing loading spinner once network request loads
      this.loading = false;
    });
  }

  protected getAmazonUrl(book: Book): string {
    // Encoding title and author for URL
    const title = encodeURIComponent(book.title);
    const author = book.authors[0].name
      ? `+${encodeURIComponent(book.authors[0].name)}`
      : '';
    return `https://www.amazon.com/s?k=${title}${author}`;
  }

  protected getCoverUrl(coverId?: number): string {    
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : 'https://via.placeholder.com/128x193.png?text=No+Cover';
  }

  protected clearSelection() {
    // Clearing the selected genre as well as setting books to an empty array to clear the display
    this.selectedGenre = '';
    this.books = [];
  }
}