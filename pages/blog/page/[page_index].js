import Layout from "@/components/Layout";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Post from "@/components/Post";
import { PER_PAGE } from "../../../config";
import { sortByDate } from "../../../utils";
import Pagination from "@/components/Pagination";
import CategoryList from "@/components/CategoryList";

export default function BlogPost({ posts, numPages, currentPage, categories }) {
  return (
    <Layout>
      <div className="flex justify-between flex-col md:flex-row">
        <div className="w-3/4 mr-10">
          <h1 className="text-5xl border-b-4 p-5 font-bold">Blog</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <Post key={index} post={post} />
            ))}
          </div>

          <Pagination currentPage={currentPage} numPages={numPages} />
        </div>

        <div className="w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths = () => {
  const files = fs.readdirSync(path.join("posts"));
  const numPages = Math.ceil(files.length / PER_PAGE);
  let paths = [];
  for (let i = 1; i < numPages; i++) {
    paths.push({ params: { page_index: i.toString() } });
  }
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({ params }) => {
  const page = parseInt((params && params.page_index) || 1);
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
  const numPages = Math.ceil(fileName.length / PER_PAGE);
  let pageIndex = page - 1;
  const orderedPages = posts
    .sort(sortByDate)
    .slice(pageIndex * PER_PAGE, (pageIndex + 1) * PER_PAGE);

  const categories = posts.map((post) => post.frontmatter.category);
  const uniqueCategories = [...new Set(categories)];
  return {
    props: {
      posts: orderedPages,
      numPages,
      currentPage: page,
      categories: uniqueCategories,
    },
  };
};
