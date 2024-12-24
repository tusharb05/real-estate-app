/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import {
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite" // @mst remove-current-line
import * as Screens from "@/screens"
import Config from "../config"
import { useStores } from "../models" // @demo remove-current-line
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator" // @demo remove-current-line
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { ComponentProps } from "react"
import { SeekerNavigator, SeekerTabPramsList } from "./SeekerNavigator"
import { AdvertiserNavigator, AdvertiserTabParamsList } from "./AdvertiserNavigator"
import { AdminNavigator, AdminTabParamsList } from "./AdminNavigator"
import { PropertyDetail } from "@/screens/PropertyDetail"
import { CreateAccount } from "@/screens/CreateAccount"
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined // @demo remove-current-line
  CreateAccount: undefined
  Demo: NavigatorScreenParams<DemoTabParamList> // @demo remove-current-line
  Seeker: NavigatorScreenParams<SeekerTabPramsList>
  Advertiser: NavigatorScreenParams<AdvertiserTabParamsList>
  AdminNavigator: NavigatorScreenParams<AdminTabParamsList>
  PropertyDetail: { propertyId: string }
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

// @mst replace-next-line const AppStack = () => {
const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: { isAuthenticated, userData },
  } = useStores()
  // @demo remove-block-end
  const {
    theme: { colors },
  } = useAppTheme()
  // let isAuthenticated = false
  console.log(isAuthenticated)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? "Welcome" : "Login"} // @demo remove-current-line
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
          {userData?.role == "Seeker" && <Stack.Screen name="Seeker" component={SeekerNavigator} />}
          {userData?.role == "Advertiser" && (
            <Stack.Screen name="Advertiser" component={AdvertiserNavigator} />
          )}
          {userData?.role == "Admin" && <Stack.Screen name="Admin" component={AdminNavigator} />}
          <Stack.Screen name="PropertyDetail" component={PropertyDetail} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </>
      )}

      {/* @demo remove-block-end */}
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
  // @mst replace-next-line }
})

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> {}

// @mst replace-next-line export const AppNavigator = (props: NavigationProps) => {
export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  )
  // @mst replace-next-line }
})
