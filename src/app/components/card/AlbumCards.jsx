"use client";

import Image from "next/image";
import styles from "../../styles/AlbumCards.module.css";
import { useRouter } from "next/navigation";


export default function AlbumCard({ title, image, id, link }) {
    const router = useRouter();
    return (
      <div className={styles.card} onClick={() => router.push(`/albums/${id}?link=${encodeURIComponent(link)}`)}>
        <div className={styles.imageWrapper}>
          <Image src={image} alt={title} fill />
        </div>
        <p className={styles.title}>{title}</p>
      </div>
    );
  }
