import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTruck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import MyButton from "../style/Button";
import MyTable from "../style/Table";
import "../css/cart-style.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/reducers/cart";
import { inputOrder } from "../redux/reducers/order";
import AddDeliveryList from "../components/AddDeliveryList";
import { useRef } from "react";

const Cart = () => {
  const cartlist = useSelector((state) => state.cartlist.cartlist);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [dataloading, setDataloading] = useState(false);
  const [productlist, setProductlist] = useState(null);
  const [deliveryPay, setDeliveryPay] = useState(3000);
  const [checkAddress, setCheckAddress] = useState("");
  const navigate = useNavigate();

  // 배송비 제외 총 금액
  const getSubtotal = () => {
    // prev: 이전값 > 현재까지 누적된 값
    // cur : 현재값
    // 0 : 초기값, 안쓰면 배열의 첫번째 요소가 들어감
    const subtotal = cartlist.reduce((prev, cur) => {
      return (prev += cur.totalPay);
    }, 0);
    return subtotal;
  };

  // cartlist의 각 아이템에 해당되는 상품 정보 넣기
  const copyCartlist = () => {
    const copyCartlist = JSON.parse(JSON.stringify(cartlist));
    for (let i = 0; i < copyCartlist.length; i++) {
      const fintProduct = productlist.find(
        (product) => product.productID == copyCartlist[i].productID
      );
      let name = "";
      switch (fintProduct.productName) {
        case "슬림 핏":
          name = "slim";
          break;
        case "스탠다드 핏":
          name = "standard";
          break;
        case "릴렉스 핏":
          name = "relax";
          break;
      }
      copyCartlist[i].category = fintProduct.category;
      copyCartlist[i].productName = fintProduct.productName;
      copyCartlist[
        i
      ].thumbnail = `${fintProduct.category}-${name}-${copyCartlist[i].color}-front.jpg`;
    }
    return copyCartlist;
  };

  // 주문하기
  const order = () => {
    if (cartlist.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    } else if (JSON.stringify(user) === "{}") {
      alert("로그인 후 이용해주세요.");
      return;
    } else if (checkAddress.trim() == "") {
      alert("배송지가 입력되었는지 확인해주세요. (상세주소 포함)");
      return;
    } else {
      dispatch(
        inputOrder({
          user: user.id,
          cartlist: copyCartlist(),
        })
      );
      dispatch(clearCart());
      navigate("/orderconfirm");
    }
  };

  // 상품리스트 데이터 들고오기 (db.json)
  useEffect(() => {
    const getData = async () => {
      const response = await fetch(
        "https://my-json-server.typicode.com/hans-4303/test/productList"
      );
      const data = await response.json();
      setProductlist(data);
      if (!productlist) {
        setDataloading(true);
      }
    };
    getData();
  }, [dataloading]);

  // 장바구니 아이템이 없으면 배송비를 0으로 출력
  useEffect(() => {
    cartlist.length == 0 ? setDeliveryPay(0) : setDeliveryPay(3000);
  }, [cartlist]);

  return (
    <>
      {productlist ? (
        <div className="cart-box">
          <div className="cart-title">
            <FontAwesomeIcon icon={faCartShopping} />
            <h2>My Cart</h2>
          </div>
          <MyTable>
            <thead>
              <tr>
                <th>상품정보</th>
                <th>사이즈</th>
                <th>수량</th>
                <th>금액</th>
                <th>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      dispatch(clearCart());
                    }}
                  >
                    Clear All
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {cartlist.length == 0 ? (
                <tr className="item-empty">
                  <td>Empty</td>
                </tr>
              ) : (
                <>
                  {cartlist.map((cartItem) => (
                    <tr key={cartItem.cartID}>
                      <CartItem
                        cartItem={cartItem}
                        productlist={productlist}
                        dispatch={dispatch}
                      />
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </MyTable>
          <div className="delivery-summary-container">
            <div className="delivery-info">
              <div className="cart-title">
                <FontAwesomeIcon icon={faTruck} />
                <h2>delivery Info</h2>
              </div>
              <AddDeliveryList setCheckAddress={setCheckAddress} />
            </div>
            <div className="summary">
              <div>
                <div>
                  <div>Subtotal</div>
                  <div>Delivery</div>
                  <div className="total">Total Price</div>
                </div>
                <div>
                  <div>{getSubtotal().toLocaleString("ko-KR")}</div>
                  <div>{deliveryPay.toLocaleString("ko-KR")}</div>
                  <div className="total">
                    {(getSubtotal() + deliveryPay).toLocaleString("ko-KR")}
                  </div>
                </div>
              </div>
              <MyButton onClick={order}>주문하기</MyButton>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Cart;
