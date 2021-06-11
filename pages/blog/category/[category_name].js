import Layout from "@/components/Layout";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Post from "@/components/Post";
import { sortByDate } from "../../../utils";
import CategoryList from "@/components/CategoryList";
export default function HomePage({ posts, categoryName, categories }) {
  return (
    <Layout>
      <div className="flex justify-between">
        <div className="w-3/4 mr-10">
          <h1 className="text-5xl border-b-4 p-5 font-bold">
            Posts in {categoryName}
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <Post key={index} post={post} />
            ))}
          </div>
        </div>

        <div className="w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </Layout>
  );
}
export const getStaticPaths = () => {
  const fileName = fs.readdirSync(path.join("posts"));
  const categories = fileName.map((file) => {
    const metaMarkdown = fs.readFileSync(path.join("posts", file), "utf-8");
    const { data: frontMatter } = matter(metaMarkdown);
    return frontMatter.category.toLowerCase();
  });
  const paths = categories.map((category) => ({
    params: { category_name: category },
  }));
  return {
    paths,
    fallback: false,
  };
};
export const getStaticProps = ({ params: { category_name } }) => {
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
  const categories = posts.map((post) => post.frontmatter.category);
  const uniqueCategory = [...new Set(categories)];
  const categoryPosts = posts.filter(
    (post) => post.frontmatter.category.toLowerCase() === category_name
  );

  return {
    props: {
      posts: categoryPosts,
      categoryName: category_name,
      categories: uniqueCategory,
    },
  };
};
