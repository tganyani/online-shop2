import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/navBar.module.scss";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { ProductInCart } from "@/types/product";
import {
  updateProductQuanty,
  removeProductFromOrder,
} from "@/store/slice/productSlice";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function NavBar() {
  const [openModal, setOpenModal] = useState(false);
  const [openMenu, setOpenMen] = useState(false);
  const dispatch = useDispatch();
  const productsInCart = useSelector(
    (state: RootState) => state.product.productInCart
  );

  function handleChangeQuantityInCart(id: number, quantity: number) {
    dispatch(
      updateProductQuanty({
        id,
        quantity,
      })
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.storeName}>TgbOnlineStore</div>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
        </ul>
        <div className={styles.shopicon}>
          <ShoppingBasketIcon
            style={{ color: "lawngreen" }}
            onClick={() => setOpenModal(!openModal)}
          />
          {productsInCart.length}
        </div>
      </div>
      <div className={styles.menu}>
        <MenuIcon onClick={() => setOpenMen(!openMenu)} />
      </div>
      <div className={openMenu ? styles.openMenu : styles.respnav}>
        <CloseIcon     
          onClick={() => setOpenMen(!openMenu)}
          className={styles.cancel}
        />
        <ul>
          <li onClick={() => setOpenMen(false)}>
            <Link href="/">Home</Link>
          </li>
          <li onClick={() => setOpenMen(false)}>
            <Link href="/products">Products</Link>
          </li>
        </ul>
      </div>
    <div className={!openModal ? styles.modal : styles.openModal} >
        {productsInCart[0] ? (
          <table>
            <thead>
              <tr>
                <th>image</th>
                <th>name</th>
                <th>cost ₽ /шт.</th>
                <th>quantity</th>
              </tr>
            </thead>
            <tbody>
              {productsInCart.map((product: ProductInCart) => (
                <tr key={product.id}>
                  <td style={{position:"relative"}}>
                    <Image src={product.image} width={60} height={60} alt="" />
                  </td>
                  <td style={{ minWidth: "60px" }}>{product.title}</td>
                  <td>{product.price * 70}</td>
                  <td>
                    <input
                      type="number"
                      defaultValue={Math.abs(product.quantity)}
                      onChange={(e) =>
                        handleChangeQuantityInCart(
                          product.id,
                          Math.abs( Number(e.currentTarget.value))
                        )
                      }
                      style={{
                        height: "30px",
                        width: "60px",
                        backgroundColor: "#ddd",
                        outline: "none",
                        border: "none",
                        textAlign: "center",
                        borderRadius: "15px",
                      }}
                    />
                    <button
                      style={{
                        width: "60px",
                        height: "30px",
                        borderRadius: "15px",
                        border: "none",
                        marginTop: "10px",
                        color: "grey",
                        fontSize: "18px",
                      }}
                      id={String(product.id)}
                      onClick={(e) =>
                        dispatch(
                          removeProductFromOrder(Number(e.currentTarget.id))
                        )
                      }
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td style={{ fontWeight: "700" }}>Sum</td>
                <td style={{ fontWeight: "700" }}>
                  {productsInCart.reduce(
                    (prev, current) =>
                      prev + current.price * current.quantity * 70,
                    0
                  )} ₽
                </td>
                <td>
                  <button
                    style={{
                      width: "100px",
                      height: "30px",
                      borderRadius: "15px",
                      border: "none",
                      backgroundColor: "#ffdc38",
                      color: "grey",
                    }}
                    onClick={() =>
                      alert("The payment is disabled for the mean time")
                    }
                  >
                    check out
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "100px" }}>
            The cart is empty !!!
          </div>
        )}
      </div>
    </div>
  );
}
