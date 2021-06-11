import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
export default function NotFoundPage() {
  return (
    <Layout title="Page not found">
      <div className="container flex flex-col items-center justify-center mx-5 my-10">
        <Image src="/404.svg" width={200} height={200} />
        <h2 className="text-4xl font-bold ">Whoopsie!</h2>
        <p className="font-medium my-7 ">
          The page/link you've requested couldn't be found or might be broken
        </p>
        <Link href="/">
          <a className="text-indigo-700 hover:text-indigo-500">
            Go back to home
          </a>
        </Link>
      </div>
    </Layout>
  );
}
