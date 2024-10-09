import { Book } from "../models/book";
import { User } from "../models/user";

const API_URL = 'https://gutendex.com/books';

async function fetchData(input: RequestInfo, init?: RequestInit){
    const response = await fetch(input, init);
    if(response.ok){
        return response;
    } else{
        const errorBody = await response.json();
        const errorMessage = errorBody.message;
        throw Error(errorMessage);
    }
}

export async function getLogInUser(): Promise<User>{
    const response = await fetchData(`/api/users`, {method: "GET"});
    return response.json();
}

export interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User>{
    const response = await fetchData(`/api/users/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export async function logIn(credentials: LoginCredentials): Promise<User>{
    const response = await fetchData(`/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logOut(): Promise<void>{
    await fetchData(`/api/users/logout`, {method: "POST"});
}

export async function getBooks(): Promise<Book[]>{
    const response = await fetchData(`/api/books`, {method: "GET"});
    return response.json();
}

export async function getBooksExternal(page: number): Promise<Book[]>{
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    return data.results.map((book: any) => ({
        _id: book.id,
        title: book.title,
        authors: book.authors.map((author: any) => author.name),
        cover: book.formats["image/jpeg"],
        ebook: book.formats["text/html"],
        genre: book.subjects[0] || "Unknown",
        languages: book.languages,
        downloads: book.download_count,
        subjects: book.subjects,
    }));
}

export interface BookInput {
    title: string;
    authors: string[];
    cover: string;
    ebook: string;
    genre: string;
    languages: string[];
    downloads: number;
    subjects: string[];
    review?: string;
}

export interface BookUpdate {
    review: string;
}

export async function createBook(book: BookInput): Promise<Book>{
    const response = await fetchData(`/api/books`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    });
    return response.json();
}

export async function updateBook(bookId: string, book: BookUpdate): Promise<Book>{
    const response = await fetchData(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    });
    return response.json();
}

export async function deleteBook(bookId: string): Promise<void>{
    await fetchData(`/api/books/${bookId}`, {method: "DELETE"});
}