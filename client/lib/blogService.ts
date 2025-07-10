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
    console.log('Attempting to add blog post:', blogData);
    const now = Timestamp.now();
    
    // Prepare data and handle undefined values
    const dataToSave: any = {
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt,
      createdAt: now,
      updatedAt: now
    };
    
    // Only include image if it's defined and not empty
    if (blogData.image && blogData.image.trim() !== '') {
      dataToSave.image = blogData.image;
    }
    
    const docRef = await addDoc(collection(db, BLOGS_COLLECTION), dataToSave);
    console.log('Successfully added blog post with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Detailed error adding blog post:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
    throw new Error('Failed to create blog post: Unknown error');
  }
};

// Update an existing blog post
export const updateBlogPost = async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, id);
    
    // Prepare updates and handle undefined values
    const updateData: any = {
      updatedAt: Timestamp.now()
    };
    
    // Only include fields that are defined
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
    
    // Handle image field specially
    if (updates.image !== undefined) {
      if (updates.image && updates.image.trim() !== '') {
        updateData.image = updates.image;
      } else {
        // If image is empty, remove it from the document
        updateData.image = null;
      }
    }
    
    await updateDoc(docRef, updateData);
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
      console.log('Firestore subscription update - documents:', querySnapshot.docs.length);
      const posts = querySnapshot.docs.map(convertDocToBlogPost);
      callback(posts);
    },
    (error) => {
      console.error('Detailed error in blog posts subscription:', error);
      // Fallback to empty array on error
      callback([]);
    }
  );
};
