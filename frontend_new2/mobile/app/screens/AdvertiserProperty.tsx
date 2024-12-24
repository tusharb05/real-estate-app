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
export const AdvertiserProperties: FC<WelcomeScreenProps> = observer(
  function AdvertiserProperties( // @mst remove-current-line
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
        title: "Advertiser Property",
        onRightPress: logout,
      },
      [logout],
    )
    // @demo remove-block-end

    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

    useEffect(() => {
      const fetchProperties = async () => {
        try {
          const data = await api.getAdvertiserProperties(authToken || "")
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

    const PropertyCard = ({ item, handleClick }: any) => (
      <TouchableOpacity onPress={() => handleClick(item.id)} style={styles.card}>
        <Image
          source={{ uri: "https://thumbs.dreamstime.com/b/web-324671543.jpg" }}
          style={styles.image}
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.price}>${item.price}</Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.status, item.status === "disabled" && styles.disabledStatus]}>
                {item.status === "active" ? "Available" : "Disabled"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )

    return (
      <FlatList
        data={properties}
        renderItem={({ item }) => <PropertyCard item={item} handleClick={handleClick} />}
        keyExtractor={(item) => item?.id}
        contentContainerStyle={styles.list}
      />
    )
    // @mst replace-next-line }
  },
) // @mst remove-current-line

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

  list: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  disabledCard: {
    opacity: 0.6, // Make disabled properties less visible
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E8B57",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "bold",
    marginRight: 10,
  },
  disabledStatus: {
    color: "#f44336", // Red for disabled status
  },
})
