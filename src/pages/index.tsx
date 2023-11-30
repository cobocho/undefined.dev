import { getAllCategories, getAllPosts, getAllTags } from '../lib/api';

import PostList from '@/components/PostList/PostList';
import Homepage from '@/components/templates/Homepage';
import SeoHead from '@/components/SeoHead/SeoHead';

import PageType from '@/types/page';
import Post from '@/types/post';
import Category from '@/types/category';

interface Props {
  allPosts: Post[];
  categories: Category[];
  allTags: string[];
}

export default function Index({ allPosts, categories, allTags }: Props) {
  const postQuantity = categories.find(({ categoryName }) => categoryName === 'All')!.quantity;
  return (
    <>
      <SeoHead page={PageType.Main} />
      <Homepage categories={categories}>
        <PostList title={'Recent'} allPosts={allPosts} postQuantity={postQuantity} />
      </Homepage>
    </>
  );
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts(['slug', 'title', 'category', 'tags', 'date', 'thumbnail', 'description', 'content'], 1);

  const allPostQuantity = getAllCategories().reduce((acc, cur) => acc + cur.quantity, 0);

  const categories = [{ categoryName: 'All', quantity: allPostQuantity }, ...getAllCategories()];
  const allTags = getAllTags();

  return {
    props: { allPosts, categories, allTags },
  };
};
