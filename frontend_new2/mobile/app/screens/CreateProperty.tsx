import { observer } from "mobx-react-lite" // @mst remove-current-line
import { FC, useEffect, useState } from "react"
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  Dimensions,
  FlatList,
  TextInput,
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
import { api } from "@/services/api"
const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

// @mst replace-next-line export const WelcomeScreen: FC<WelcomeScreenProps> = (
export const CreateProperty: FC<WelcomeScreenProps> = observer(
  function CreateProperty( // @mst remove-current-line
    _props, // @demo remove-current-line
    // @mst replace-next-line ) => {
  ) {
    // const { themed, theme } = useAppTheme()
    // @demo remove-block-start
    const { navigation } = _props
    const {
      authenticationStore: { logout, authToken },
    } = useStores()

    const [error, setError] = useState("")

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [location, setLocation] = useState("")
    const [status, setStatus] = useState("active")
    const [imageUrl, setImageUrl] = useState("")
    const [loading, setLoading] = useState(false)

    useHeader(
      {
        rightTx: "common:logOut",
        title: "Create Property",
        onRightPress: logout,
      },
      [logout],
    )
    // @demo remove-block-end

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

    // useEffect(() => {
    //   const fetchProperties = async () => {
    //     try {
    //       const data = await api.getSeekerProperties(authToken || "")
    //       console.log("\n\n\n\n\n")
    //       console.log(data)
    //       console.log("\n\n\n\n\n")
    //       setProperties(data)
    //     } catch (error) {
    //       setError((error as Error).message) // Display the error message
    //     } finally {
    //       // setLoading(false)
    //     }
    //   }

    //   fetchProperties()
    // }, [])

    const handleSubmit = async () => {
      setLoading(true)

      try {
        let data = await api.createProperty({
          title,
          description,
          price,
          location,
          status,
          token: authToken,
        })
        console.log("submitted:")
        console.log(data)
        navigation.goBack()
        // router.replace("/advertiser/properties")
      } catch (error: any) {
        console.log("ERROR")
        // console.error(error);
        // Alert.alert("Error", "An error occurred") //
      } finally {
        setLoading(false)
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Create Property</Text>

        <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />
        {/* <TextInput
          placeholder="Status (active/disabled)"
          value={status}
          onChangeText={setStatus}
          style={styles.input}
        /> */}
        {/* <TextInput
          placeholder="Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
        /> */}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Create Property"}
        </TouchableOpacity>
      </View>
    )
    // @mst replace-next-line }
  },
) // @mst remove-current-line

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: "#f3f4f6",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "inherit",
    color: "white",
  },
  button: {
    backgroundColor: "steelblue",
    fontFamily: "Arial",
    paddingVertical: 7,
    color: "white",
    textAlign: "center",
    borderRadius: 6,
  },
})
