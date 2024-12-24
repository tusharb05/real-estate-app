import { Instance, SnapshotOut, types } from "mobx-state-tree"

const UserDataModel = types.model("UserData", {
  id: types.identifier, // Unique identifier for the user
  username: types.string,
  email: types.string,
  password: types.string, // Typically, you would not store plaintext passwords in a real-world app
  role: types.enumeration("Role", ["Seeker", "Advertiser", "Admin"]), // Adjust roles as needed
  createdAt: types.string, // ISO timestamp
  updatedAt: types.string, // ISO timestamp
})

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    userData: types.maybe(UserDataModel),
    loggedIn: types.optional(types.boolean, false),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
      store.loggedIn = false
      store.userData = undefined
    },
    setUserData(data: any) {
      store.userData = data
    },
    setLoggedIn(val: boolean) {
      store.loggedIn = val
    },
  }))

// export const AuthenticationStoreModel = types
//   .model("AuthenticationStore")
//   .props({
//     authToken: types.maybe(types.string),
//     loggedIn: types.boolean,
//     userData: types.maybe(UserDataModel),
//     authEmail: types.string,
//   })
//   .views((store) => ({
//     get isAuthenticated() {
//       return store.loggedIn
//     },
//     // get isAuthenticated() {
//     //   return !!store.authToken
//     // },
//     get validationError() {
//       if (store.authEmail.length === 0) return "can't be blank"
//       if (store.authEmail.length < 6) return "must be at least 6 characters"
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
//         return "must be a valid email address"
//       return ""
//     },
//   }))
//   .actions((store) => ({
//     setAuthToken(value?: string) {
//       store.authToken = value
//     },

//     setuserData(value: any) {
//       store.userData = value
//     },

//     setLoggedIn(value: boolean) {
//       store.loggedIn = value
//     },

//     logout() {
//       store.loggedIn = false
//       store.authToken = ""
//     },
//     // setAuthToken(value?: string) {
//     //   store.authToken = value
//     // },
//     setAuthEmail(value: string) {
//       store.authEmail = value.replace(/ /g, "")
//     },
//     // logout() {
//     //   store.authToken = undefined
//     //   store.authEmail = ""
//     // },
//   }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
