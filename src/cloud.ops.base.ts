import { CloudOps, KeyValuePair } from './contracts';
import { Document, DocumentConstructor } from './document';
import { User } from './user';

/**
 * Abstract cloud ops implementation.
 */
export abstract class CloudOpsBase implements CloudOps {
  protected abstract getDocument(
    path: string,
    id: string
  ): Promise<KeyValuePair>;

  protected abstract createDocument(
    document: any,
    path: string
  ): Promise<KeyValuePair>;

  protected abstract updateDocument(
    document: any,
    path: string
  ): Promise<KeyValuePair>;

  protected abstract deleteDocument(path: string, id: string): Promise<void>;

  protected abstract loginUser(
    email: string,
    password: string
  ): Promise<KeyValuePair>;

  protected abstract getCurrentUser(): Promise<KeyValuePair>;

  abstract connect(): Promise<void>;

  abstract disconnect(): Promise<void>;

  async getDoc<T extends Document>(
    documentType: DocumentConstructor<T>,
    path: string,
    id: string
  ): Promise<T> {
    const result = await this.getDocument(path, id);
    return new documentType(result);
  }

  async createDoc<T extends Document>(document: T, path: string): Promise<T> {
    const result = await this.createDocument(document.out(), path);
    document.id = result.id;
    return document;
  }

  async updateDoc<T extends Document>(document: T, path: string): Promise<T> {
    await this.updateDocument(document.out(), path);
    return document;
  }

  async deleteDoc<T extends Document>(
    document: T,
    path: string
  ): Promise<void> {
    return this.deleteDocument(path, document.id);
  }

  abstract register(user: User): Promise<void>;

  async login(email: string, password: string): Promise<User> {
    const user = await this.loginUser(email, password);
    return new User(user);
  }

  abstract logout(): Promise<void>;

  abstract resetPassword(email: string);

  async getActiveUser(): Promise<User> {
    const user = await this.getCurrentUser();
    return new User(user);
  }

  abstract uploadFile(file: File, path: string, name: string): Promise<string>;
}
