export interface Book {
    _id: string;
    title: string;
    authors: string[];
    cover: string;
    ebook: string;
    genre: string;
    downloads: number;
    subjects: string[];
    languages: string[];
    review?: string;
    createdAt: string;
    updatedAt: string;
}