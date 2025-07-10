import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db, BLOGS_COLLECTION } from './firebase';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Convert Firestore document to BlogPost
const convertDocToBlogPost = (doc: any): BlogPost => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    image: data.image,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date()
  };
};

// Add a new blog post
export const addBlogPost = async (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
      ...blogData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding blog post:', error);
    throw new Error('Failed to create blog post');
  }
};

// Update an existing blog post
export const updateBlogPost = async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw new Error('Failed to delete blog post');
  }
};

// Get all blog posts (one-time fetch)
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const q = query(collection(db, BLOGS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
};

// Subscribe to real-time blog posts updates
export const subscribeToBlogPosts = (callback: (posts: BlogPost[]) => void): (() => void) => {
  const q = query(collection(db, BLOGS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, 
    (querySnapshot) => {
      const posts = querySnapshot.docs.map(convertDocToBlogPost);
      callback(posts);
    },
    (error) => {
      console.error('Error in blog posts subscription:', error);
      // Fallback to empty array on error
      callback([]);
    }
  );
};
