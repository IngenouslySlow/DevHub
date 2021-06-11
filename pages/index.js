import Layout from "@/components/Layout";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Post from "@/components/Post";
import { sortByDate } from "../utils";
export default function HomePage({ posts }) {
  return (
    <Layout>
      <h1 className="text-3xl p-5 border-b-4 font-bold">Latest Posts</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
      <Link href="/blog">
        <a className=" block text-center border-gray-500 border text-gray-800 rounded-md py-4 my-5 px-10 mx-40 transition duration-500 ease select-none hover:text-white hover:bg-gray-900 focus:outline-none focus:shadow-outline ">
          All Posts
        </a>
      </Link>
    </Layout>
  );
}

export const getStaticProps = () => {
  const fileName = fs.readdirSync(path.join("posts"));
  const posts = fileName.map((file) => {
    const slug = file.replace(".md", "");
    const metaMarkdown = fs.readFileSync(path.join("posts", file), "utf-8");
    const { data: frontmatter } = matter(metaMarkdown);
    return {
      slug,
      frontmatter,
    };
  });
  return {
    props: { posts: posts.sort(sortByDate).slice(0, 6) },
  };
};
