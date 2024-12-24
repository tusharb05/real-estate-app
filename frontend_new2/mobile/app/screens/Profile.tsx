import { observer } from "mobx-react-lite" // @mst remove-current-line
import { FC } from "react"
import {
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
} from "react-native"
import {
  Button, // @demo remove-current-line
  Text,
  Screen,
} from "@/components"
import { isRTL } from "../i18n"
import { useStores } from "../models" // @demo remove-current-line
import { AppStackScreenProps } from "../navigators"
import { $styles, type ThemedStyle } from "@/theme"
import { useHeader } from "../utils/useHeader" // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/utils/useAppTheme"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

// @mst replace-next-line export const WelcomeScreen: FC<WelcomeScreenProps> = (
export const Profile: FC<WelcomeScreenProps> = observer(
  function Profile( // @mst remove-current-line
    _props, // @demo remove-current-line
    // @mst replace-next-line ) => {
  ) {
    const { themed, theme } = useAppTheme()
    // @demo remove-block-start
    const { navigation } = _props
    const {
      authenticationStore: { logout, userData },
    } = useStores()

    // function goNext() {
    //   navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
    // }

    useHeader(
      {
        rightTx: "common:logOut",
        onRightPress: logout,
      },
      [logout],
    )
    // @demo remove-block-end

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Image
            source={{
              uri:
                userData?.avatar ||
                "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2526512481.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.username}>Name: {userData?.username || "User Name"}</Text>
          <Text style={styles.email}>Email: {userData?.email || ""}</Text>
          <Text style={styles.bio}>Password: {userData?.password || ""}</Text>
          <Text style={styles.bio}>Role: {userData?.role || ""}</Text>
        </View>
        <View style={{ paddingHorizontal: 50, marginTop: 16 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              logout()
              // setLoggedIn(false)
              // setUserData({})
              // setToken("")
              // router.push("/signin")
            }}
          >
            Logout
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
    // @mst replace-next-line }
  },
) // @mst remove-current-line

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    fontFamily: "Arial",
    paddingVertical: 7,
    color: "white",
    textAlign: "center",
    borderRadius: 6,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 16,
  },
})
