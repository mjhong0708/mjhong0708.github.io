import { getCollection, type CollectionEntry } from "astro:content"

export async function getPublishedPosts() {
  return getCollection("blog", (post) => post.data.draft !== true)
}

export function sortPostsByDateDesc(posts: CollectionEntry<"blog">[]) {
  return [...posts].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )
}

export function getPostHref(post: CollectionEntry<"blog">) {
  return `/posts/${post.data.slug}`
}

export function hasTag(post: CollectionEntry<"blog">, tag: string) {
  return (post.data.tags ?? []).includes(tag)
}

export function getAllTags(posts: CollectionEntry<"blog">[]) {
  const tagsSet = new Set<string>()
  posts.forEach((post) => {
    const tags = post.data.tags ?? []
    tags.forEach((tag) => tagsSet.add(tag))
  })
  return Array.from(tagsSet).sort()
}

export function groupPostsByYear(posts: CollectionEntry<"blog">[]) {
  const postsByYear: Record<string, CollectionEntry<"blog">[]> = {}
  posts.forEach((post) => {
    const year = new Date(post.data.date).getFullYear().toString()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  })
  return postsByYear
}

export function getYearsDesc(
  postsByYear: Record<string, CollectionEntry<"blog">[]>,
) {
  return Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))
}
