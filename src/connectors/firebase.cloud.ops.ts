import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Firestore,
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { CloudOpsBase } from '../cloud.ops.base';
import { isString } from '../util';
import { User } from '../user';

export interface FirebaseConnectorOptions {
  apiKey?: string;
  projectId?: string;
  senderId?: string;
  appId?: string;
}

/**
 * Handles all the operations with the Firebase cloud.
 */
export class FirebaseCloudOps extends CloudOpsBase {
  private readonly _apiKey: string = null;

  private readonly _projectId: string = null;

  private readonly _senderId: string = null;

  private readonly _appId: string = null;

  private _app: FirebaseApp = null;

  private _db: Firestore = null;

  constructor(options: FirebaseConnectorOptions) {
    super();

    const { apiKey, projectId, senderId, appId } = options;

    isString(apiKey) && (this._apiKey = apiKey);
    isString(projectId) && (this._projectId = projectId);
    isString(senderId) && (this._senderId = senderId);
    isString(appId) && (this._appId = appId);
  }

  protected async getDocument(path: string, id: string): Promise<any> {
    const docRef = doc(this._db, path, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data(), id };
    }

    return null;
  }

  protected async createDocument(document: any, path: string): Promise<any> {
    let docRef;

    if (document.id) {
      docRef = await setDoc(doc(this._db, path, <string>document.id), document);
    } else {
      docRef = await addDoc(collection(this._db, path), document);
      document.id = docRef.id;
    }

    return document;
  }

  protected async updateDocument(
    document: any,
    path: string,
    merge: boolean = false
  ): Promise<any> {
    const op = merge ? updateDoc : setDoc;
    await op(doc(this._db, path, document.id), document);
    return document;
  }

  protected async deleteDocument(path: string, id: string): Promise<void> {
    await deleteDoc(doc(this._db, path, id));
  }

  protected async loginUser(email: string, password: string): Promise<any> {
    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    let userCredential;

    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (ex) {
      throw ex;
    }

    const { user } = userCredential;
    const userRef = await this.getDoc(User, `users`, user.uid);

    return {
      id: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      ...userRef
    };
  }

  protected async getCurrentUser(): Promise<any> {
    return new Promise(res => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        res(user);
      });
    });
  }

  connect(): Promise<void> {
    this._app = initializeApp({
      apiKey: this._apiKey,
      authDomain: `${this._projectId}.firebaseapp.com`,
      projectId: this._projectId,
      storageBucket: `${this._projectId}.appspot.com`,
      messagingSenderId: this._senderId,
      appId: this._appId
    });

    this._db = getFirestore(this._app);
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  register(user: User): Promise<void> {
    return Promise.resolve(undefined);
  }

  logout(): Promise<void> {
    const auth = getAuth();
    return signOut(auth);
  }

  async resetPassword(email: string): Promise<void> {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email, { url: `TODO` });
  }

  async uploadFile(file: File, path: string, name: string): Promise<string> {
    const storage = getStorage(),
      fileName = name ? `${path}/${name}` : `${path}/${file.name}`,
      storageRef = ref(storage, fileName);

    const uploadResult = await uploadBytes(storageRef, file);
    return getDownloadURL(uploadResult.ref);
  }
}
