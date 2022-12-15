import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import DaumPostcodeEmbed from "./DaumPostcodeEmbed";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import Delivery from "./Delivery";

const Mypage = () => {
  // 택배사 목록 state
  const [carriers, setCarriers] = useState([]);
  const [delivery, setDelivery] = useState();
  const [trackId, setTrackId] = useState("");
  const [carrierId, setCarrierId] = useState("");
  const [result, setResult] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setResult(true);
  };
  const navigate = useNavigate();

  const changeCarrierId = (e) => {
    setCarrierId(e.target.value);
  };

  const changeTrackId = (e) => {
    setTrackId(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // map https://apis.tracker.delivery/carriers/:carrier_id/tracks/:track_id 패치값 가져와서 배송지 조회기능 구현
    const getDelivery = async () => {
      const json = await (
        await fetch(
          `https://apis.tracker.delivery/carriers/${carrierId}/tracks/${trackId}`
        )
      ).json();
      setDelivery(json);
    };
    getDelivery();
    setResult(false);
  };

  // 택배사 목록 비동기로 가져오기
  const getCarriers = async () => {
    const json = await (
      await fetch(`https://apis.tracker.delivery/carriers`)
    ).json();
    setCarriers(json);
  };
  useEffect(() => {
    getCarriers();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      {/* 회원정보 수정 form */}
      <h4>회원정보 수정</h4>

      <UsetInfo>
        <Labels className="labels">
          <label>이름</label>
          <label>휴대폰 번호</label>
          <label>아이디</label>
          <label>비밀번호 변경</label>
          <label>비밀번호 확인</label>
        </Labels>

        <Inputs>
          <input type="text" defaultValue="홍길동" />
          <input type="text" defaultValue="010-****-1234" />
          <input type="text" defaultValue="roadBronze" />
          <input type="password" placeholder="비밀번호를 입력하세요" />
          <input type="password" placeholder="비밀번호를 입력하세요" />
        </Inputs>

        <DaumPostcodeEmbed />
      </UsetInfo>
      <button>회원정보 수정</button>

      {/* 주문/배송조회 form  */}
      <MypageOrder>
        <h4>주문/배송 조회</h4>
        <MypageHead>
          <div>상품정보</div>
          <div>주문일자</div>
          <div>주문금액(수량)</div>
          <div>주문상태</div>
        </MypageHead>

        {/* 장바구니 상품 목록 */}
        <MypageBody>
          <MypagePd>
            <div>
              <img
                className="img"
                src="https://foremanbrosinc.com/wp-content/uploads/2017/05/1c0d0f0cb8b7f2fb2685da9798efe42b_big-image-png-image-placeholder-clipart_2400-2400-300x300.png"
                alt=""
                style={{
                  width: "200px",
                  height: "100px",
                }}
              />
            </div>
            <MypageInfo>
              {/* 상품 정보 */}
              <div>
                <span>short sleeve t-shirt</span>
                <span>standard fit</span>
                <span> (navy) </span>
              </div>

              {/* 프린팅 면 정보*/}
              <div>
                <span>print : </span>
                <span>front</span>
              </div>

              {/* 사이즈 정보 */}
              <div>
                <span>size : </span>
                <span>S</span>
              </div>
            </MypageInfo>
          </MypagePd>

          <div>2022.11.11</div>

          <MypageColum>
            <div>9,500원</div>
            <div>1개</div> {/* 연한 회색 처리 */}
          </MypageColum>

          <MypageColum>
            <div>배송중</div>
            <button onClick={handleOpen}>배송조회</button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {result ? (
                  <form onSubmit={onSubmit}>
                    <select onChange={changeCarrierId} value={carrierId}>
                      {/* 택배사 목록 map로 option설정 */}
                      {carriers.map((array) => {
                        return (
                          <option value={array.id} key={array.id}>
                            {array.name}
                          </option>
                        );
                      })}
                    </select>
                    <input
                      type="number"
                      placeholder="운송장번호"
                      onChange={changeTrackId}
                      defaultValue={trackId}
                    />
                    <button>조회</button>
                  </form>
                ) : !delivery?.message ? (
                  <Delivery
                    stateText={delivery?.state.text}
                    toName={delivery?.to.name}
                    carrierName={delivery?.carrier.name}
                    carrierTel={delivery?.carrier.tel}
                    carrierId={delivery?.carrier.id}
                    message={delivery?.message}
                  />
                ) : (
                  <div>
                    <p>{delivery?.message}</p>
                  </div>
                )}
              </Box>
            </Modal>
          </MypageColum>
        </MypageBody>
      </MypageOrder>

      {/* 이벤트 배너 form  */}
      <MypageEvent>
        <h4>이벤트</h4>
      </MypageEvent>
      <div
        style={{ width: "100%", height: "200px", backgroundColor: "skyblue" }}
      >
        <Slider {...settings}>
          <div>
            <img
              src="https://foremanbrosinc.com/wp-content/uploads/2017/05/1c0d0f0cb8b7f2fb2685da9798efe42b_big-image-png-image-placeholder-clipart_2400-2400-300x300.png"
              alt=""
              onClick={() => navigate("/event")}
              style={{
                width: "100%",
                height: "50px",
              }}
            />
          </div>
          <div>
            <img
              src="https://foremanbrosinc.com/wp-content/uploads/2017/05/1c0d0f0cb8b7f2fb2685da9798efe42b_big-image-png-image-placeholder-clipart_2400-2400-300x300.png"
              alt=""
              onClick={() => navigate("/event")}
              style={{
                width: "100%",
                height: "50px",
              }}
            />
          </div>
          <div>
            <img
              src="https://foremanbrosinc.com/wp-content/uploads/2017/05/1c0d0f0cb8b7f2fb2685da9798efe42b_big-image-png-image-placeholder-clipart_2400-2400-300x300.png"
              alt=""
              onClick={() => navigate("/event")}
              style={{
                width: "100%",
                height: "50px",
              }}
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Mypage;

const UsetInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`;

const Labels = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
`;

const Inputs = styled.form`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
`;

const MypageOrder = styled.div`
  margin-top: 50px;
`;

const MypageHead = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  border: solid 1px;
  padding: 20px 0;
`;

const MypageBody = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  border: solid 1px;
  padding: 20px 0;
`;

const MypagePd = styled.div`
  display: flex;
  align-items: center;
`;

const MypageInfo = styled.div`
  flex-direction: column;
  margin-left: 10px;
`;

const MypageColum = styled.div`
  text-align: center;
`;

const MypageEvent = styled.div`
  margin-top: 50px;
`;
