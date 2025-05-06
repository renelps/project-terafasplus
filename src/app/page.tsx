import imageHero from "../../public/assets/hero.png";
import HeroClient from "../components/HeroClient/HeroClient";
import { db } from "@/services/firebase/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";

export const revalidate = 60;

export default async function HomePage() {
  const postsSnapshot = await getDocs(collection(db, "tasks"));
  const commentsSnapshot = await getDocs(collection(db, "comments"));

  const postsCount = postsSnapshot.size || 0;
  const commentsCount = commentsSnapshot.size || 0;

  return (
    <HeroClient
      image={imageHero}
      posts={postsCount}
      comments={commentsCount}
    />
  );
}
