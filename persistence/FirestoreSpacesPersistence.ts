import {Space} from "src/spaces/models/Space";
import {useSpacesStore} from "src/spaces/stores/spacesStore";
import {useAuthStore} from "stores/authStore";
import {collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import FirebaseServices from "src/services/firebase/FirebaseServices";
import {LocalStorage} from "quasar";
import {useUiStore} from "src/ui/stores/uiStore";
import SpacesPersistence from "src/spaces/persistence/SpacesPersistence";

const STORE_IDENT = 'spaces';

function spaceDoc(spaceId: string) {
  return doc(FirebaseServices.getFirestore(), "users", useAuthStore().user.uid, STORE_IDENT, spaceId)
}

function spacesCollection() {
  return collection(FirebaseServices.getFirestore(), "users", useAuthStore().user.uid, STORE_IDENT)
}

class FirestoreSpacesPersistence implements SpacesPersistence {

  getServiceName(): string {
    return this.constructor.name
  }

  async init() {
    console.debug(" ...initializing GitPersistenceService")
    //this.indexedDB = useDB(undefined).db as typeof IndexedDbPersistenceService
    return Promise.resolve("")
  }

  async loadSpaces(): Promise<any> {
    useUiStore().syncing = true
    LocalStorage.set("ui.spaces.lastUpdate", new Date().getTime());
    (await getDocs(spacesCollection())).forEach((doc) => {
      let newItem = doc.data() as Space
      newItem.id = doc.id;
      useSpacesStore().addSpace(newItem)
    })
    useUiStore().syncing = false
    return Promise.resolve(undefined);
  }

  async addSpace(entity: Space): Promise<any> {
    useUiStore().syncing = true
    await setDoc(spaceDoc(entity.id), JSON.parse(JSON.stringify(entity)))
    useUiStore().syncing = false
  }

  async deleteSpace(entityId: string) {
    useUiStore().syncing = true
    await deleteDoc(spaceDoc(entityId))
    useUiStore().syncing = false
  }

  compactDb(): Promise<any> {
    return Promise.resolve(undefined);
  }

  migrate(): any {
    // no op
  }


}

export default new FirestoreSpacesPersistence()
