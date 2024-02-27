import { Injectable, Signal, signal } from '@angular/core';
import { Storage, deleteObject, getDownloadURL, listAll, ref, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';

import { Attachment } from './file-upload.model';

export type RootPath = 'claims' | 'invoices';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private storage: Storage) { }

  async pushFileToStorage(files: FileList, rootPath: RootPath, userId: string): Promise<Attachment[]> {

    const userPath = `${rootPath}/${userId}`;

    // Get all files uploaded by user tp generate next name
    const listRef = ref(this.storage, userPath);
    const allFileNames = await listAll(listRef);
    const firstFileCount = allFileNames.items.length + 1;

    const attachments: Attachment[] = [];

    for (let index = 0; index < files.length; index++) {

      const file = files.item(index)!;
      const fileneme = (firstFileCount + index).toString();

      const storagePath = userPath + '/' + fileneme;

      // Create the file metadata
      const metadata = {
        //  contentType: 'image/jpeg',
        //  originalFilename: fileUpload.file.name
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(this.storage, storagePath);
      const snap = await uploadBytes(storageRef, file, metadata);

      const downloadURL = await getDownloadURL(snap.ref);

      const newFile: Attachment = {
        storagePath: storagePath,
        originalFilename: file.name,
        url: downloadURL,
      }

      attachments.push(newFile);
    }

    return attachments;

  }

  deleteFile(fileUpload: Attachment): void {
    const storageRef = ref(this.storage, fileUpload.storagePath);
    deleteObject(storageRef);
  }

}
