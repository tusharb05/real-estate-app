import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from "react-native"
import { api } from "@/services/api"
import { Link } from "@react-navigation/native"
interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props
  // const authPasswordInput = useRef<TextInput>(null)

  // const [authPassword, setAuthPassword] = useState("")
  // const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  // const [isSubmitted, setIsSubmitted] = useState(false)
  // const [attemptsCount, setAttemptsCount] = useState(0)
  // const {
  //   authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  // } = useStores()

  // const {
  //   themed,
  //   theme: { colors },
  // } = useAppTheme()

  // useEffect(() => {
  //   // Here is where you could fetch credentials from keychain or storage
  //   // and pre-fill the form fields.
  //   setAuthEmail("ignite@infinite.red")
  //   setAuthPassword("ign1teIsAwes0m3")

  //   // Return a "cleanup" function that React will run when the component unmounts
  //   return () => {
  //     setAuthPassword("")
  //     setAuthEmail("")
  //   }
  // }, [setAuthEmail])

  // const error = isSubmitted ? validationError : ""

  // function login() {
  //   setIsSubmitted(true)
  //   setAttemptsCount(attemptsCount + 1)

  //   if (validationError) return

  //   // Make a request to your server to get an authentication token.
  //   // If successful, reset the fields and set the token.
  //   setIsSubmitted(false)
  //   setAuthPassword("")
  //   setAuthEmail("")

  //   // We'll mock this with a fake token.
  //   setAuthToken(String(Date.now()))
  // }

  // const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
  //   () =>
  //     function PasswordRightAccessory(props: TextFieldAccessoryProps) {
  //       return (
  //         <Icon
  //           icon={isAuthPasswordHidden ? "view" : "hidden"}
  //           color={colors.palette.neutral800}
  //           containerStyle={props.style}
  //           size={20}
  //           onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
  //         />
  //       )
  //     },
  //   [isAuthPasswordHidden, colors.palette.neutral800],
  // )

  const {
    authenticationStore: { setUserData, setLoggedIn, setAuthEmail, setAuthToken },
  } = useStores()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const validateForm = () => {
    let valid = true

    if (!email) {
      setEmailError("Email is required")
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email")
      valid = false
    } else {
      setEmailError("")
    }

    if (!password) {
      setPasswordError("Password is required")
      valid = false
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      valid = false
    } else {
      setPasswordError("")
    }

    return valid
  }

  const handleSignIn = async () => {
    // if (validateForm()) {
    //   Alert.alert("Success", "Signed in successfully!");
    //   console.log("heloooooooooooooooooooo");
    //   // Here you would handle sign-in logic, such as calling an API
    // }
    if (validateForm()) {
      try {
        const data = await api.loginFunction(email, password)
        console.log(data)
        console.log("Login successful:", data)
        setUserData(data.user)
        setLoggedIn(true)
        setAuthToken(data.tokens.access.token)
        // Alert.alert("Success", "Signed in successfully!");
        // if (data.user.role == "Seeker") {
        //   router.push("/seeker/properties");
        // } else if (data.user.role == "Admin") {
        //   router.push("/admin");
        // } else if (data.user.role == "Advertiser") {
        //   router.push("/advertiser");
        // }
        // Handle successful login here, such as setting user data or navigating
      } catch (error) {
        console.log("Login failed. Please check your credentials and try again.")
        console.log("Login error:", error)
      }
    }
  }

  function redirect() {
    navigation.navigate("CreateAccount")
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* <Link href="/(auth)/signup" style={styles.link}>
          Don't have an account?
        </Link> */}
      </View>
      <TouchableOpacity style={styles.link} onPress={redirect}>
        Don't have an account?
      </TouchableOpacity>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  link: {},
  container: {
    display: "flex",
    flex: 1,
    // justifyContent: "center",
    // marginTop: 40,
    paddingHorizontal: 20,
    // backgroundColor: "#fff",
    marginTop: 40,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "#f00",
  },
  errorText: {
    color: "#f00",
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#6169FF",
    marginTop: 5,
  },
})
