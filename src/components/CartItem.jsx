import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MyButton from "../style/Button";
import "../css/cartlist.css";
import "../css/cart.css";
import { Desktop, Tablet, Mobile, Default } from "../hooks/MediaQuery";

import {
  quantityIncrease,
  quantityDecrease,
  quantityInput,
  deleteItem,
} from "../redux/reducers/cart";
import { useRef, useEffect, useState } from "react";

// 사용자 도안 모달
const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-object",
  maxHeight: "80%",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

const UserDesignModal = ({ userImg }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="cart-modal">
      <MyButton variant="outlined" color="inherit" onClick={handleOpen}>
        도안
      </MyButton>
      <Modal open={open} onClose={handleClose}>
        <Box sx={boxStyle} className="cart-modal-box">
          {userImg.map((item, i) => (
            <div key={i}>
              <div>{item.print}</div>
              <img src={item.imageUrl} alt="No Image" />
            </div>
          ))}
        </Box>
      </Modal>
    </div>
  );
};

// 장바구니 아이템
const CartItem = (props) => {
  const { cartItem, productlist, dispatch } = props; // Cart.jsx
  const [totalPay, setTotalPay] = useState(cartItem.totalPay);
  // 상품리스트에서 장바구니에 담긴 아이템들의 상품정보 찾기
  const product = productlist.find(
    (productItem) => productItem.productID == cartItem.productID
  );
  const price = parseInt(product.price.replace(",", ""));
  const [userImg, setUserImg] = useState([]);
  // 구매수량이 바뀔 때마다 반영하기 위한 ref
  const inputRef = useRef();

  // 구매 수량 변경 : +1 , -1, 직접입력
  const onDecrease = () => {
    dispatch(
      quantityDecrease({
        cartID: cartItem.cartID,
        productPrice: price,
      })
    );
  };
  const onIncrease = () => {
    dispatch(
      quantityIncrease({
        cartID: cartItem.cartID,
        productPrice: price,
      })
    );
  };
  const onInput = (e) => {
    dispatch(
      quantityInput({
        cartID: cartItem.cartID,
        productPrice: price,
        value: e.target.value,
      })
    );
  };

  // 상품 이미지 경로
  const getImgPath = () => {
    const findIndex = product.colorName.findIndex(
      (item) => item === cartItem.color
    );
    switch (product.category) {
      case "short":
        return require(`../img/shirts-img/short/${product.thumbnail[findIndex]}`);
      case "long":
        return require(`../img/shirts-img/long/${product.thumbnail[findIndex]}`);
      default:
        return undefined;
    }
  };

  // 장바구니 아이템의 ImgArr(사용자 도안 배열)을 print: front - back 순으로 정렬
  useEffect(() => {
    if (cartItem.imgArray.length === 2) {
      const newArr =
        cartItem.imgArray[0].print == "back"
          ? cartItem.imgArray.slice(0).reverse()
          : cartItem.imgArray;
      setUserImg(newArr);
    } else {
      setUserImg(cartItem.imgArray);
    }
  }, []);

  // 구매 수량이 바뀔 때마다 input과 totalPay에 반영
  useEffect(() => {
    inputRef.current.value = cartItem.quantity;
    setTotalPay(cartItem.totalPay);
  }, [cartItem.quantity]);

  return (
    <>
      {/** 웹 화면 */}
      <Default>
        <td className="table-product-container">
          <img src={getImgPath()} alt="No Image" />
          <div>
            <div className="table-product-name">
              {product.category} {product.productName}
            </div>
            <div>
              <span className="table-product-label">color</span>
              <span>{cartItem.color}</span>
            </div>
            <div>
              <span className="table-product-label">size</span>
              <span>{cartItem.size}</span>
            </div>
            <Tablet>
              <span className="table-product-label">print</span>
              {userImg?.length === 2 ? (
                <span>
                  {userImg[0]?.print} / {userImg[1]?.print}
                </span>
              ) : (
                <span>{userImg[0]?.print}</span>
              )}
              <UserDesignModal userImg={userImg} />
            </Tablet>
          </div>
        </td>
        <Desktop>
          <td>
            {userImg?.length === 2 ? (
              <>
                {userImg[0]?.print} / {userImg[1]?.print}
              </>
            ) : (
              <>{userImg[0]?.print}</>
            )}
            <UserDesignModal userImg={userImg} />
          </td>
        </Desktop>
        <td className="quantity-container">
          <IconButton onClick={onDecrease}>
            <RemoveIcon />
          </IconButton>
          <input
            type="number"
            defaultValue={cartItem.quantity}
            ref={inputRef}
            onChange={onInput}
          />
          <IconButton onClick={onIncrease}>
            <AddIcon />
          </IconButton>
        </td>
        <td>{totalPay.toLocaleString("ko-KR")}</td>
        <td>
          <IconButton
            onClick={() => {
              dispatch(deleteItem(cartItem.cartID));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </td>
      </Default>

      {/** 모바일 화면 */}
      <Mobile>
        <td>
          <img src={getImgPath()} alt="No Image" />
          <UserDesignModal userImg={userImg} />
        </td>
        <td className="table-product-container">
          <div className="table-product-name">
            {product.category} {product.productName}
          </div>
          <div>
            <span className="table-product-label">color</span>
            <span>{cartItem.color}</span>
          </div>
          <div>
            <span className="table-product-label">size</span>
            <span>{cartItem.size}</span>
          </div>
          <div>
            <span className="table-product-label">print</span>
            {userImg?.length === 2 ? (
              <span>
                {userImg[0]?.print} / {userImg[1]?.print}
              </span>
            ) : (
              <span>{userImg[0]?.print}</span>
            )}
          </div>
        </td>
        <td>
          <IconButton
            onClick={() => {
              dispatch(deleteItem(cartItem.cartID));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </td>
        <td>
          <div className="quantity-container">
            <IconButton onClick={onDecrease}>
              <RemoveIcon />
            </IconButton>
            <input
              type="number"
              defaultValue={cartItem.quantity}
              ref={inputRef}
              onChange={onInput}
            />
            <IconButton onClick={onIncrease}>
              <AddIcon />
            </IconButton>
          </div>
          <div>₩ {totalPay.toLocaleString("ko-KR")}</div>
        </td>
      </Mobile>
    </>
  );
};

export default CartItem;
