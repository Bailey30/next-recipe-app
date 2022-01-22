import { sanityClient, urlFor, usePreviewSubscription, PortableText } from "../../lib/sanity"
import { useState } from "react"
import { useRouter } from "next/router"

//The value of the slug field is stored on the "current" property.
const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,  
        wholeNumber, 
        fraction, 
        ingredient->{ 
            name
        }
    },
    instructions,
    likes
}`


////dereference because we are getting ingredient from the recipe where the ingredient was referenced
export default function OneRecipe({ data, preview }) {
    // const router = useRouter()
    
    
    // if (!data) return <div>Loading...</div>;


    // const { data: recipe } = usePreviewSubscription(recipeQuery, {
    //     //params -- works the same as the client, can add info to the query to find the correct recipe by its slug
    //     params: { slug: data.recipe?.slug.current },
    //     //intialdata -- the data that is returned before the real time updates start up - typically the data that comes from get static props -- data should be the same shape as what you get out of usePreviewSubscription
    //     initialData: data,
    //     //controls if preview should be activated or not
    //     enabled: preview,
    // })

    const [likes, setLikes] = useState(data?.recipe?.likes)

    const addLike = async () => {
        const res = await fetch("/api/handle-like", {
            method: "POST",
            body: JSON.stringify({ _id: recipe._id })
        }).catch((error) => console.log(error))


        const data = await res.json()

        setLikes(data.likes)
    }
    const {recipe} = data
    return (
        <article className="recipe">
            <h1></h1>{recipe.name}
            <button className="like-button" onClick={addLike}>
                {likes}
            </button>

            <main className="content">
                <img src={urlFor(recipe?.mainImage).url()} alt={recipe.name} />
                <div className="breakdown">
                    <ul className="ingredients">
                        {recipe?.ingredient?.map((ingredient) => (
                            <li key={ingredient._key} className="ingredient">
                                {ingredient?.wholeNumber}
                                {ingredient?.fraction}
                               
                                {ingredient?.unit}
                                <br />
                                {ingredient?.ingredient?.name}

                            </li>

                        ))}
                    </ul>
                    <PortableText blocks={recipe?.instructions} className="instructions" />
                </div>
            </main>
        </article>
    )
}

export async function getStaticPaths() {
    const paths = await sanityClient.fetch(
        `*[_type == "recipe" && defined(slug.current)]{
            "params":{
                "slug": slug.current
            }
        }`
    )
    return {
        paths,
        fallback: true //prevents 404 error if page doesnt exists, will find a version of the page, will then add it to static paths
    }
}

export async function getStaticProps({ params }) {
    const { slug } = params
    const recipe = await sanityClient.fetch(recipeQuery, { slug })
    return { props: { data: { recipe }, preview: true } }
}