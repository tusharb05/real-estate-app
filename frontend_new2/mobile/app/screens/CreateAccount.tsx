import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Alert } from "react-native"
import { api } from "@/services/api"
import { Picker } from "@react-native-picker/picker"
interface CreateAccount extends AppStackScreenProps<"CreateAccount"> {}

export const CreateAccount: FC<CreateAccount> = observer(function LoginScreen(_props) {
  const { navigation } = _props
  const {
    authenticationStore: { setUserData, setLoggedIn, setAuthEmail, setAuthToken },
  } = useStores()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Advertiser") // Default role is Advertiser

  const [fullNameError, setFullNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateForm = () => {
    let valid = true

    // Full Name validation
    if (!fullName) {
      setFullNameError("Full name is required")
      valid = false
    } else {
      setFullNameError("")
    }

    // Email validation
    if (!email) {
      setEmailError("Email is required")
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email")
      valid = false
    } else {
      setEmailError("")
    }

    // Password validation
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

  const handleSignUp = async () => {
    if (validateForm()) {
      // Here you would handle sign-up logic, such as calling an API
      let data = await api.createAccount({
        email,
        password,
        role,
        username: fullName,
      })
      setUserData(data.user)
      setLoggedIn(true)
      setAuthToken(data.tokens.access.token)

      // if (data.user.role == "Seeker") {
      //   router.push("/seeker/properties")
      // } else if (data.user.role == "Admin") {
      //   router.push("/admin")
      // } else if (data.user.role == "Advertiser") {
      //   router.push("/advertiser")
      // }
    } else {
      Alert.alert("Check all the fields carefully")
    }
  }

  const redirect = () => {
    navigation.navigate("Login")
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, fullNameError ? styles.inputError : null]}
            placeholder="Enter your full name"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={setFullName}
          />
          {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}
        </View>

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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Advertiser" value="Advertiser" />
              <Picker.Item label="Seeker" value="Seeker" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={redirect}>
          Don't have an account?
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    // backgroundColor: "#f8f8f8",
    marginTop: 40,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
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
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#333",
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
