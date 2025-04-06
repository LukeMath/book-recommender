import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface Book {
  title: string;
  cover_id: number;
  authors: { name: string }[];
}

interface OpenLibraryApiResponse {
  key: string;
  name: string;
  subject_type: string;
  work_count: number;
  works: Book[];
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
  protected errorMessage = '';

  constructor(private http: HttpClient) {}

  protected onGenreChange() {
    // Displaying loading spinner while waiting for network request to load
    this.loading = true;
    const subject = this.selectedGenre.toLowerCase();
    const url = `https://openlibrary.org/subjects/${subject}.json?limit=10`;
    this.http.get<OpenLibraryApiResponse>(url).pipe(
      catchError(() => {
        this.errorMessage = 'An error occurred while fetching data. Please try again later.';
        return of([]);
      })
    ).subscribe((res: any) => {
      // OR statement used here to not have any TypeErrors if network request throws an error
      this.books = res.works || [];
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
    // Clearing the dropdown and books display or error message (based on the network request)
    this.selectedGenre = '';
    this.books = [];
    this.errorMessage = '';
  }
}