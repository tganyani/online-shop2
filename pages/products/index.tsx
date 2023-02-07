import { type } from "os";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import styles from "@/styles/products.module.scss";
import Rating from "@mui/material/Rating";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import {
  addProductToOrder,
  removeProductFromOrder,
} from "@/store/slice/productSlice";
import { useRouter } from "next/router";

export default function Products({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  function handleAddProductTocart(id: number) {
    dispatch(
      addProductToOrder({
        ...products.filter((product) => product.id === id)[0],
        quantity: 1,
      })
    );
  }
  return (
    <div className={styles.product}>
      {products.map((product: Product) => (
        <div key={product.id} className={styles.card}>
          <div className={styles.image}>
            <Link href={`/products/${String(product.id)}`}>
              <Image
                src={product.image}
                fill
                sizes="(max-width: 600px) 90vw"
                alt=""
              />
            </Link>
          </div>
          <div className={styles.ratings}>
            <p>electronics</p>{" "}
            <Rating name="read-only" value={product.rating.rate} readOnly />{" "}
            {product.rating.count > 300 && <p>{product.rating.count}-отзыва</p>}
          </div>
          <div className={styles.description}>
            {product.description}
            <div
              className={styles.readmore}
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div >
                <ArrowRightAltIcon style={{ color: "white" }} />
              </div>
            </div>
          </div>
          <div className={styles.price}>{product.price * 70}₽ /шт.</div>
          <div className={styles.footer}>
            <div  style={{position:"relative" , zIndex:"23"}} className={styles.btnContainer}>
            <div className={styles.btn}>
              <button  onClick={() => handleAddProductTocart(product.id)}>
                В корзине
              </button>
              <span
                style={{ fontSize: "20px" }}
                onClick={() =>
                  dispatch(removeProductFromOrder(Number(product.id)))
                }
              >
                -1
              </span>
            </div>
            </div>
            <FavoriteBorderIcon
              className={!liked ? styles.fvr : styles.liked}
              onClick={() => setLiked(!liked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<{ products: Product[] }> = async (
  context
) => {
  const res = await fetch("https://fakestoreapi.com/products");
  const products: Product[] = await res.json();
  return {
    props: {
      products,
    },
  };
};
