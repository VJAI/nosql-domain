import { Document, DocumentConstructor } from './document';
import { User } from './user';

/**
 * Represents all the cloud operations.
 */
export interface CloudOps {
  /**
   * Initialize objects and other things.
   */
  connect(): Promise<void>;

  /**
   * Clean-up stuff.
   */
  disconnect(): Promise<void>;

  /**
   * Returns document of the passed type from the path.
   * @param documentType
   * @param path
   * @param id
   */
  getDoc<T extends Document>(
    documentType: DocumentConstructor<T>,
    path: string,
    id: string
  ): Promise<T>;

  /**
   * Creates document in the passed path.
   * @param document
   * @param path
   */
  createDoc<T extends Document>(document: T, path: string): Promise<T>;

  /**
   * Updates document in the passed path.
   * @param document
   * @param path
   */
  updateDoc<T extends Document>(document: T, path: string): Promise<T>;

  /**
   * Deletes document from the passed path.
   * @param document
   * @param path
   */
  deleteDoc<T extends Document>(document: T, path: string): Promise<void>;

  /**
   * Registers new user.
   * @param user
   */
  register(user: User): Promise<void>;

  /**
   * Authenticates user with the cloud provider.
   * @param email
   * @param password
   */
  login(email: string, password: string): Promise<User>;

  /**
   * Logs out the user.
   */
  logout(): Promise<void>;

  /**
   * Reset the user's password.
   * @param email
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Returns active user.
   */
  getActiveUser(): Promise<User>;

  /**
   * Uploads file to cloud.
   * @param file
   * @param path
   * @param name
   */
  uploadFile(file: File, path: string, name: string): Promise<string>;
}

/**
 * Represents an object like data structure.
 */
export interface KeyValuePair {
  [key: string]: any;
}
