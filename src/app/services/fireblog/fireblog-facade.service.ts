import { Injectable } from '@angular/core';
import { collectionData, docData } from '@angular/fire/firestore';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBlog, IUser } from '../blog.interface';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FireblogFacadeService {
  currentUser = new BehaviorSubject<IUser | null>(null);
  getCurrentUser$: Observable<IUser|null>  = this.currentUser.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) {
    this.initializeCurrentUser();
  }

  private initializeCurrentUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const iUser: IUser = {
          email: user.email || '',
          uid: user.uid,
          username: user.displayName || '',
          image: user.photoURL || '',
          password: '' // We don't store the password
        };
        this.currentUser.next(iUser);
      } else {
        this.currentUser.next(null);
      }
    });
  }



  getBlogPosts(): Observable<IBlog[]> {
    const blogPostsCollection = collection(this.firestore, 'fireblogPosts');
    return collectionData(blogPostsCollection, { idField: 'id' }) as Observable<IBlog[]>;
  }

  async createBlogPost(user: IUser, content: string): Promise<string> {
    const newBlog: IBlog = {
      content: content,
      createdAt: new Date().toISOString(),
      likes: '0',
      user: user,
      authorId: user.uid,
      comments: []
    };
    const blogPostsCollection = collection(this.firestore, 'fireblogPosts');
    const docRef = await addDoc(blogPostsCollection, newBlog);
    return docRef.id;
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
