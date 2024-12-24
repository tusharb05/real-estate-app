import { observer } from "mobx-react-lite" // @mst remove-current-line
import { FC, useState, useEffect } from "react"
import {
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
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
// import { RouteProp } from "@react-navigation/native";

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}
// @mst replace-next-line export const WelcomeScreen: FC<WelcomeScreenProps> = (
export const PropertyDetail: FC<WelcomeScreenProps> = observer(function PropertyDetail( // @mst remove-current-line
  { navigation, route }, // @demo remove-current-line
) {
  console.log(route.params)
  const { propertyId } = route.params
  const [property, setProperty]: any = useState({})
  const [advertiser, setAdvertiser]: any = useState({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const {
    authenticationStore: { logout, authToken, userData },
  } = useStores()

  useHeader(
    {
      rightTx: "common:logOut",
      title: "Admin Properties",
      onRightPress: logout,
    },
    [logout],
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await api.getPropertyDetail(propertyId, authToken)
        setProperty(data.property)
        setAdvertiser(data.advertiser)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleClick = async () => {
    await api.deleteProperty(propertyId, authToken)
    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Property Detail</Text>
      <View style={styles.card}>
        {/* <Image source={{ uri: property.imageUrl }} style={styles.image} /> */}
        <Image
          source={{ uri: "https://thumbs.dreamstime.com/b/web-324671543.jpg" }}
          style={styles.image}
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.description}>{property.description}</Text>
          <Text style={styles.price}>Price: ${property.price}</Text>
          <Text style={styles.location}>Location: {property.location}</Text>
          <Text
            style={[styles.status, property.status === "active" ? styles.active : styles.disabled]}
          >
            Status: {property.status}
          </Text>
        </View>
      </View>

      <View style={styles.advertiserContainer}>
        <Text style={styles.advertiserTitle}>Advertiser Details</Text>
        <Text style={styles.advertiserInfo}>Name: {advertiser.username}</Text>
        <Text style={styles.advertiserInfo}>Email: {advertiser.email}</Text>
      </View>

      {userData?.role === "Advertiser" && (
        <View style={{ marginTop: 20 }}>
          {/* <Button title="Delete Property" color="#f44336" onPress={handleClick} /> */}
          <TouchableOpacity onPress={handleClick} style={styles.button}>
            Delete Property
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}) // @mst remove-current-line

const styles = StyleSheet.create({
  button: {
    paddingVertical: 7,
    textAlign: "center",
    borderRadius: 7,
    backgroundColor: "red",
    color: "white",
  },
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
    overflow: Platform.OS === "ios" ? "hidden" : "visible",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  active: {
    color: "green",
  },
  disabled: {
    color: "red",
  },
  advertiserContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
  },
  advertiserTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  advertiserInfo: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
})
