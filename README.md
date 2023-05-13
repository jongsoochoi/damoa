# Damoa(다모아)

프로젝트 Damoa(다모아)는 다 * 와의 최저 가격 변동을 수집하여 소비자가 가격 변동을 쉽게 확인 할 수 있도록 만들었습니다.
다 * 와 사이트에서도 가격 변동을 1개월/3개월/6개월/12개월만 제공하기에 프로젝트 Damoa(다모아)는 가격 변동을 매일 체크하여
가격 변동을 쫌도 자세하게 알 수 있도록 만들었습니다.

>서버 기능

* 다*와 사이트에서 주소를 복사하여 앱에 입력시 상품을 등록합니다.
  * 서버에 해당 상품의 데이터가 없는 경우 테스트용 가격 20개와 당일 가격을 저장 후 앱에 전달 합니다.
  * 서버에 해당 상품의 데이터가 있는 경우 해당 상품의 데이터에 변동 사항이 있냐 없냐에 따라 다른 반응을 합니다.
    *  현재 상품의 데이터에서 변동 사항이 있다면 최신 데이터를 업데이트 후 앱에 전달 합니다.
    *  현재 상품의 데이터에서 변동 사항이 없다면 서버 데이터를 앱에 전달 합니다.
  * 매시간 서버에 등록되어 있는 상품 데이터를 확인하여 최저가격의 변동 시 최신화를 합니다.
  * 매일 서버에 등록되어 있는 상품 데이터의 가격 데이터의 날짜 순서를 확인하며 순서에 문제가 없는지 체크합니다.

>기획 의도

여러 사이트 중 최저 가격 정보를 매일 모아서 가격 정보의 변화를 한 눈에 보기 좋게 만들려고 하는데서 시작하였습니다.

>변경 사항 & 변경된 이유

1. 여러 사이트에서 가격을 가져오는 것에서 다 * 와의 최저가만 가져오게 변경 하였습니다.

기획 단계에서는 상품을 고르면 네 * 버, 11 * 가, 지 * 켓, 쿠 * 등 모든 사이트에서 가격을 비교하는 사이트를 만들고 싶었습니다만
해당 상품의 개수, 개수에 따른 가격 변화, 상품 이름의 통일 되지 않음 등의 이유로 같은 상품을 모으고 등록하는데 어려움이 있었습니다.
또한 사이트 마다 API를 제공하는 것이 아니므로 모든 정보는 스크래핑으로만 이루어져야만 했습니다.
한개의 상품 가격을 최신화 하는데 여러 사이트 스크랩핑 하여 가격을 비교하는 것이 비효율적이라 판단되었습니다.
또한 가격을 비교해주는 사이트의 경우 판매 사이트나 판매자가 직접 파트너로 등록하여 가격 비교를 할 수 있는 것으로 보였습니다.
그리하여 가격 비교 사이트의 가격을 스크래핑 하기로 정하였습니다.

2. 네 * 버 와 다 * 와의 데이터를 비교하여 저장하는 것은 왜 안 하였나?
가격 비교 사이트에 피해를 주는 사이트가 아닌 가격 비교 사이트에 도움이 되는 앱을 만드는게 목적이었습니다.
그리하여 가격 비교 사이트도 한 곳만 정하여 그곳의 가격 변동 폭만 알려주고 또한 저의 앱에서 그 사이트 주소만 제공하여
자연스럽게 그 사이트로 접근하게 만든 것 입니다.


