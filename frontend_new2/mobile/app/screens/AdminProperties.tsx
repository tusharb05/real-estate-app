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
  Switch,
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
export const AdminProperties: FC<WelcomeScreenProps> = observer(function AdminProperties(_props) {
  const { navigation } = _props
  const {
    authenticationStore: { logout, authToken },
  } = useStores()

  const [properties, setProperties] = useState([])
  const [error, setError] = useState("")

  useHeader(
    {
      rightTx: "common:logOut",
      title: "Admin Properties",
      onRightPress: logout,
    },
    [logout],
  )

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  useEffect(() => {
    // Mock API call (replace with actual API call)
    const fetchProperties = async () => {
      try {
        const data = await api.getAdminProperties(authToken || "")
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

  const handleToggleStatus = async (
    // event: any,
    id: string,
    status: "active" | "disabled",
  ) => {
    setProperties((prevProperties: any) =>
      prevProperties.map((property: any) =>
        property.id === id
          ? {
              ...property,
              status: property.status === "active" ? "disabled" : "active",
            }
          : property,
      ),
    )
    // console.log("\n\n\n");
    // console.log("STATUS: ", status);
    if (status === "active") {
      // property is being disabled
      await api.disableProperty(id, authToken || "")
    } else {
      await api.enableProperty(id, authToken || "")
    }
  }

  const PropertyCard = ({ item, handleClick }: { item: any; handleClick: any }) => (
    <TouchableOpacity
      onPress={() => handleClick(item.id)}
      style={[styles.card, item.status === "disabled" && styles.disabledCard]}
    >
      {/* <Image source={{ uri: item.imageUrl }} style={styles.image} /> */}
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
            <TouchableOpacity>
              <Switch
                value={item.status === "active"}
                onValueChange={() => handleToggleStatus(item.id, item.status)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={properties}
      renderItem={({ item }) => <PropertyCard item={item} handleClick={handleClick} />}
      keyExtractor={(item: any) => item.id}
      contentContainerStyle={styles.list}
    />
  )
  // // @mst replace-next-line }
}) // @mst remove-current-line

const styles = StyleSheet.create({
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
    opacity: 0.6,
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
    color: "#f44336",
  },
})
