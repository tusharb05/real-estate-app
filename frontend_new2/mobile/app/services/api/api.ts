/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async loginFunction(email: string, password: string) {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        "http://localhost:3000/v1/auth/login",
        { email, password }, // Adding the email in the request body
      )

      if (response.ok) {
        // Handle successful response
        console.log("Login successful:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Login failed:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async getSeekerProperties(token: string) {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(
        "http://localhost:3000/v1/property/get-seeker-properties",
        undefined, // No body for GET request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        console.log("Properties retrieved successfully:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Failed to retrieve properties:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async getAdvertiserProperties(token: string) {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(
        "http://localhost:3000/v1/property/get-advertiser-properties",
        undefined, // No body for GET request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        console.log("Properties retrieved successfully:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Failed to retrieve properties:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async getAdminProperties(token: string) {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(
        "http://localhost:3000/v1/property/get-admin-properties",
        undefined, // No body for GET request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        console.log("Properties retrieved successfully:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Failed to retrieve properties:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async enableProperty(propertyId: string, token: string) {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        "http://localhost:3000/v1/property/enable",
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        // console.log("Login successful:", response.data)
        return response.data
      } else {
        // Handle error response
        // console.error("Login failed:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async disableProperty(propertyId: string, token: string) {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        "http://localhost:3000/v1/property/disable",
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        console.log("Disable successful:", response.data)
        return response.data
      } else {
        // Handle error response
        // console.error("Login failed:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async getPropertyDetail(propertyId: any, token: any) {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(
        "http://localhost:3000/v1/property/get-property-detail",
        undefined, // No body for GET request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header
            propertyId: propertyId,
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        console.log("Properties retrieved successfully:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Failed to retrieve properties:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async deleteProperty(propertyId: any, token: any) {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        "http://localhost:3000/v1/property/delete",
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        console.log("Deletion successful:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Deletion failed:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async createProperty({
    title,
    description,
    price,
    location,
    status,
    // imageUrl,
    token,
  }: any) {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        "http://localhost:3000/v1/property/create",
        { title, description, price, location, status, imageUrl: "" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        // Handle successful response
        console.log("Deletion successful:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Deletion failed:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }

  async createAccount({ email, password, role, username }: any) {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        "http://localhost:3000/v1/auth/register",
        { email, password, role, username }, // Adding the email in the request body
      )

      if (response.ok) {
        // Handle successful response
        console.log("Registeration successful:", response.data)
        return response.data
      } else {
        // Handle error response
        console.error("Registeration failed:", response.problem, response.data)
        return null
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error)
      throw error
    }
  }
  /*
   
  

  
   */
  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  // async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
  //   // make the api call
  //   const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
  //     `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
  //   )

  //   // the typical ways to die when calling an api
  //   if (!response.ok) {
  //     const problem = getGeneralApiProblem(response)
  //     if (problem) return problem
  //   }

  //   // transform the data into the format we are expecting
  //   try {
  //     const rawData = response.data

  //     // This is where we transform the data into the shape we expect for our MST model.
  //     const episodes: EpisodeSnapshotIn[] =
  //       rawData?.items.map((raw) => ({
  //         ...raw,
  //       })) ?? []

  //     return { kind: "ok", episodes }
  //   } catch (e) {
  //     if (__DEV__ && e instanceof Error) {
  //       console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
  //     }
  //     return { kind: "bad-data" }
  //   }
  // }
  // @demo remove-block-end
}

// Singleton instance of the API for convenience
export const api = new Api()
