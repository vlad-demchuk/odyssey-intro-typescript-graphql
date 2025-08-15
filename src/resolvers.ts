import { validateFullAmenities } from "./helpers";
import { Resolvers } from "./types"

export const resolvers: Resolvers = {
  Query: {
    featuredListings: (_, __, { dataSources }) => {
      return dataSources.listingAPI.getFeaturedListings()
    },
    listing: (_, args, { dataSources }) => {
      return dataSources.listingAPI.getListing(args.id)
    }
  },
  Mutation: {
    createListing: async (_, args, { dataSources }) => {
      try {
        const response = await dataSources.listingAPI.createListing(args.input);
        return {
          code: 200,
          success: true,
          message: "Listing successfully created!",
          listing: response,
        };
      } catch (err) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${err.extensions.response.body}`,
          listing: null,
        };
      }
    }
  },
  Listing: {
    amenities: (parent, _, { dataSources }) => {
      return validateFullAmenities(parent.amenities)
    ? parent.amenities
    : dataSources.listingAPI.getListingAmenities(parent.id);
    }
  }
}