import { GetStaticProps, InferGetStaticPropsType } from "next";
import type { Product } from "@/types/product";
import styles from "../../styles/product.module.scss";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from 'next/router'

export default function Product({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) {
const router = useRouter()

  return (
    <div className={styles.product}>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "20px",
          backgroundColor: "#ffdc38",
          position: "fixed",
          left: "12px",
          zIndex:"55"
        }}
        onClick={()=>router.push('/products')}
      >
        <div
          style={{
            width:"100%",
            height:"100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowBackIcon style={{ color: "white" }} />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.header}>
          <h4>{product.title}</h4>
        </div>
        <div className={styles.image}>
          <div className={styles.imgcontainer}>
            <Image id={styles.im} src={product.image} fill alt="" />
          </div>
        </div>
        <div className={styles.rating}>
          <Rating name="read-only" value={product.rating.rate} readOnly />
        </div>
        <div className={styles.desc}>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  const products: Product[] = await res.json();
  const paths = products.map((product: Product) => {
    return {
      params: { id: String(product.id) },
    };
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ product: Product }> = async ({
  params,
}: any) => {
  const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
  const product: Product = await res.json();
  return {
    props: {
      product,
    },
  };
};
