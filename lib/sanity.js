import {
    createClient,
    createPreviewSubscriptionHook,
    createImageUrlBuilder,
    createPortableTextComponent,
} from "next-sanity"

const config = {
    projectId: "jr28dng9", //from studio/sanity.json
    dataset: "production",
    apiVersion: "2021-03-25",
    useCdn: false, //global cache network
}

export const sanityClient = createClient(config)

export const usePreviewSubscription = createPreviewSubscriptionHook(config)

export const urlFor = (source) => createImageUrlBuilder(config).image(source) // source is asset data we are querying from the content link

export const PortableText = createPortableTextComponent({
    ...config,
    serializers: {},
})