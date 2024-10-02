import { Injectable } from '@angular/core';
import { collectionData, docData } from '@angular/fire/firestore';
import {  collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IBlog, IUser } from '../blog.interface';

@Injectable({
  providedIn: 'root'
})
export class FireblogFacadeService {

  constructor(private firestore:Firestore) {}

  getBlogPosts(): Observable<IBlog[]> {
    const blogPostsCollection = collection(this.firestore, 'fireblogPosts');
    return collectionData(blogPostsCollection, { idField: 'id' }) as Observable<IBlog[]>;
  }

  getBlogPost(id: string): Observable<IBlog> {
    const blogPostDoc = doc(this.firestore, `fireblogPosts/${id}`);
    return docData(blogPostDoc, { idField: 'id' }) as Observable<IBlog>;
  }

  async createEmptyBlogPost(user: IUser): Promise<string> {
    const emptyBlog: IBlog = {
      content: '',
      createdAt: new Date().toISOString(),
      likes: '0',
      user: user,
      authorId: user.uid,
      comments: []
    };
    const blogPostsCollection = collection(this.firestore, 'fireblogPosts');
    const docRef = await addDoc(blogPostsCollection, emptyBlog);
    return docRef.id;
  }

  async updateBlogPost(id: string, blogPost: Partial<IBlog>): Promise<void> {
    const blogPostDoc = doc(this.firestore, `fireblogPosts/${id}`);
    await updateDoc(blogPostDoc, blogPost);
  }

  async deleteBlogPost(id: string): Promise<void> {
    const blogPostDoc = doc(this.firestore, `fireblogPosts/${id}`);
    await deleteDoc(blogPostDoc);
  }
}
