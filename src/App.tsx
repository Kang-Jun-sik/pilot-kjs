import React, { useCallback, useEffect, useState } from 'react';

function App() {
  const [text, setText] = useState<string>('response: ');
  const [content, setContent] = useState<string>('A(상황 별 화법), B(고객 보장 분석), C(상품 정보) 3개의 데이터를 분석하고 조합해서 고객에게 좋은 보험 상품을 추천하기 위한 설득력 있는 가장 적절한 초 개인화 된 구체적인 숫자와 금액을 예로 들어 최대한 긴 화법을 생성해 주세요.');

  /**
   * 분석 요청할 데이터
   * @type {string}
   */

  const SYSTEM_MESSAGE = [
//     {
//       role: 'system',
//       content: `
//       당신은 데이터 분석 전문가입니다.
//       `,
//     },
//     {
//       role: 'system',
//       content: `
//     물어보는 것을 아래 내용을 통해서만 답해주세요.
    
// [
//   {
//     "상품명:": "한화생명 시그니처 암보험 2.0(갱신형) 무배당(30년만기) 일반플랜형",
//     "계약일자" : "2022년11월01일",
//     "주계약": "암수술자금",
//     "가입금액(천원)" : "5,000",
//     "보험료(원)": "2,650",
//     "납입기간": "30년납",
//     "보험기간" : "30년",
//     "특약부가내용" : "특정암보험료납입면제Ⅲ(갱)(T)",
//     "가입금액(천원)": "9",
//     "보험료(원)" : 575,
//     "납입기간": "20년납",
//     "보험기간": "20년"
//   }
// ]
//     `
//     }
      {
        role: 'system',
        content: `
        당신은 보험 영업 및 교육 베테랑 전문가 입니다.
        아래 A(상황 별 화법), B(고객 보장 분석), C(상품 정보) 3개의 데이터를 분석하고 조합해서
        고객에게 좋은 보험 상품을 추천하기 위한 설득력 있는 가장 적절한 초 개인화 된 구체적인 숫자와 금액을 예로 들어 최대한 긴 화법을 생성해 주세요.
        예를 들면 화법 시작과 마무리 부분은 A데이터를 활용하고,
        중간 부분은 B데이터를 근거 자료(구체적인 숫자 및 금액 언급 필수!)로 활용하여 C데이터의 보험 상품을 추천(상품의 모든 특징 및 구체적인 숫자와 금액 언급 필수!)하는
        초 개인화 된 구체적인 숫자와 금액을 예로 들어 최대한 긴 화법을 서술형으로 생성해 주세요.
        A= "1. 상황: 이미 보험을 많이 들었다는 고객의 거절 처리 화법
            2. 내용: 고객님은 역시 미래를 잘 준비하신 분이십니다. 그런데 보험을 많이 가입 하신 분들일수록 제대로 가입한 보험 인지를 살펴봐 드리는 사람이 필요한 것 같습니다. 제가 내일 그 쪽으로 갈 일이 있습니다. 이 기회에 컨설팅을 한번 받아보시길 권유 드립니다. 아무런 대가도 필요치 않는 일입니다.,
        B= "
        1. 고객정보
          1) 고객명: 김한화
          2) 연령: 40세
          3) 성별: 남자
          4) 직업: 사무직
          5) 결혼유무: 기혼
          6) 자녀유무: 1명(초등)
        2. 계약정보
          1) 가입현황 비교
            - 보유건수: 김한화(2건), 유사고객(5건)
            - 월납입보험료: 김한화(30만원), 유사고객(50만원)
          2) 보장자산 비교
            - 사망보장(일반): 김한화(2억원)으로 유사고객(4억원)에 비해 부족함
            - 사망보장(재해): 김한화(1억원)으로 유사고객(5억원)에 비해 부족함
            - 진단보장(암): 김한화(2천만원)으로 유사고객(4천만원)에 비해 부족함
            - 진단보장(CI): 김한화(2천만원)으로 유사고객(4천만원)에 비해 부족함
            - 진단보장(특정질병): 김한화(1천만원)으로 유사고객(5천만원)에 비해 부족함
            - 입원: 김한화(2천만원)으로 유사고객(4천만원)에 비해 부족함
            - 수술: 김한화(4천만원)으로 유사고객(2천만원)에 비해 충분함
          3) 노후 준비 비교
            - 월납입보험료: 김한화(20만원)으로 유사고객(30만원)에 비해 부족함
            - 기납입보험료: 김한화(1천만원)으로 유사고객(2천만원)에 비해 부족함
            - 완납시 예상 총납입보험료: 김한화(3천만원)으로 유사고객(6억2천만원)에 비해 부족함",
        C="
        1. 상품 정보
        1) 상품명: 시그니처 암보험3.0"
        2) 특징
          가. 보험료를 더 저렴하게!
            - 새로생긴 5년 갱신형 일반암 진단으로 일반암+유사암 복층설계 가능
            - 예시: 남자40세 기준 시그니처 암보험2.0의 경우 일반암 5,000만원(20년갱신) + 유사암 1,000만원(20년갱신)  = 보험료 28,100원 이었지만, 시그니처 암보험3.0의 경우 일반암 1,000만원(20년갱신) + 일반암 4,000만원(5년갱신) + 유사암 1,000만원(20년갱신) = 보험료 18,340으로 34.7% 보험료가 줄어듬
          나. 골라담는 암보장 S특약
            - 또 걸려도 5번만? 업계 최대 횟수 부위별 7번 보장!
          다. 암사망플러스보장S특약 
            - 암 사망에 대한 두려움과 일반 사망에 대한 두려움을 모두 해결!
            - 암진단 유무에 관계없이 살아만 있다면 완납 이후 환급률 100% 이상 UP! 사망보장+환급금 두가지 혜택을 100세까지"
        `,
      },
  ];

  const getRes = () => {
    setText('');
    // async function
    (async () => {
      // GPT API 호출
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'post',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_GPT_POC_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // GPT 모델. 'gpt-4'는 따로 신청해야 함
          messages: [
            ...SYSTEM_MESSAGE,
            { role: 'user', content: content }, // 보낼 데이터
          ],
          user: 'test', // 유저 구분자
          // max_tokens: 4097, // 최대 제한 토큰 (글자수와는 약간 다름)
          stream: true, // stream으로 요청
        })
      })

      // 응답이 있으면 처리
      if (response.ok && response.body) {
        // const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        const reader = response.body.getReader()

        // 스트림으로 받은 응답 처리 함수
        while (true) {
          const { value, done } = await reader.read();
          if (done) { // 종료되었으면 break;
            await reader.cancel();
            break;
          }

          // 응답 처리
          new TextDecoder().decode(value).split('data: ').forEach((decoded) => {
            try {
              // char 단위로 state에 삽입
              const content = JSON.parse(decoded).choices[0].delta.content;
              if (content) {
                setText((prev) => prev + content);
              }
            } catch (e) { }
          });
        }

      }
    })()
  }

  const onChange = useCallback((e: { target: { value: React.SetStateAction<string>; }; }) => {
    setContent(e.target.value);
  }, []);

  useEffect(() => {

  }, [])

  return (
    <>
      <div>
        <input type="text" style={{ width: '700px' }} value={content} onChange={onChange} id="keywords" name="keywords" required />
        <button onClick={getRes}> 질문하기 </button>
      </div>
      <div>{text}</div>
    </>
  );
}

export default App;
