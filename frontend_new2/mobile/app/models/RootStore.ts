import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line
import { EpisodeStoreModel } from "./EpisodeStore" // @demo remove-current-line

/**
 * A RootStore model.
 */

export const UserDataModel = types.model("UserData", {
  id: types.identifier, // Unique identifier for the user
  username: types.string,
  email: types.string,
  password: types.string, // Typically, you would not store plaintext passwords in a real-world app
  role: types.enumeration("Role", ["Seeker", "Admin", "Other"]), // Adjust roles as needed
  createdAt: types.string, // ISO timestamp
  updatedAt: types.string, // ISO timestamp
})

export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  // episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

// @mst remove-file
