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
export const WelcomeScreen: FC<WelcomeScreenProps> = observer(
  function WelcomeScreen( // @mst remove-current-line
    _props, // @demo remove-current-line
    // @mst replace-next-line ) => {
  ) {
    // const { themed, theme } = useAppTheme()
    // @demo remove-block-start
    const { navigation } = _props
    const {
      authenticationStore: { logout, authToken },
    } = useStores()

    const [properties, setProperties] = useState([])
    const [error, setError] = useState("")

    useHeader(
      {
        rightTx: "common:logOut",
        onRightPress: logout,
      },
      [logout],
    )
    // @demo remove-block-end

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

    useEffect(() => {
      const fetchProperties = async () => {
        try {
          const data = await api.getSeekerProperties(authToken || "")
          console.log("\n\n\n\n\n")
          console.log(data)
          console.log("\n\n\n\n\n")
          setProperties(data)
        } catch (error) {
          setError((error as Error).message) // Display the error message
        } finally {
          // setLoading(false)
        }
      }

      fetchProperties()
    }, [])

    const handleClick = (propertyId: string) => {
      navigation.navigate("PropertyDetail", { propertyId })
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )
    }

    return (
      <FlatList
        data={properties}
        // @ts-ignore
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => <PropertyCard item={item} handleClick={handleClick} />}
        contentContainerStyle={styles.listContainer}
      />
    )
    // @mst replace-next-line }
  },
) // @mst remove-current-line

const PropertyCard = ({ item, handleClick }: { item: any; handleClick: any }) => {
  return (
    <TouchableOpacity onPress={() => handleClick(item.id)}>
      <View style={styles.card}>
        {/* <Image source={{ uri: item.imageUrl }} style={styles.image} /> */}
        <Image
          source={{ uri: "https://thumbs.dreamstime.com/b/web-324671543.jpg" }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").width * 0.6,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
})

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
