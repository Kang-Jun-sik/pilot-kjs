import React, {useEffect, useState} from 'react';


const API_KEY = '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'

function App() {
  const [text, setText] = useState('response: ');

  /**
   * 분석 요청할 데이터
   * @type {string}
   */
  const content = `시그니처 암보험의 주계약에 대해 설명해줘.`
  const SYSTEM_MESSAGE = [
    {
      role: 'system',
      content: `
      당신은 데이터 분석 전문가입니다.
      `,
    },
    {
      role: 'system',
      content: `
    물어보는 것을 아래 json을 통해서만 답해주세요.
    
[
  {
    "상품명:": "한화생명 시그니처 암보험 2.0(갱신형) 무배당(30년만기) 일반플랜형",
    "계약일자" : "2022년11월01일",
    "주계약": "암수술자금",
    "가입금액(천원)" : "5,000",
    "보험료(원)": "2,650",
    "납입기간": "30년납",
    "보험기간" : "30년",
    "특약부가내용" : "특정암보험료납입면제Ⅲ(갱)(T)",
    "가입금액(천원)": "9",
    "보험료(원)" : 575,
    "납입기간": "20년납",
    "보험기간": "20년"
  }
]

    `
    }
  ];


  useEffect(() => {
    // async function
    (async () => {
      // GPT API 호출
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'post',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // GPT 모델. 'gpt-4'는 따로 신청해야 함
          messages: [
            ...SYSTEM_MESSAGE,
            {role: 'user', content}, // 보낼 데이터
          ],
          user: 'test', // 유저 구분자
          max_tokens: 3000, // 최대 제한 토큰 (글자수와는 약간 다름)
          stream: true, // stream으로 요청
        })
      })

      // 응답이 있으면 처리
      if (response.ok && response.body) {
        // const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        const reader = response.body.getReader()

        // 스트림으로 받은 응답 처리 함수
        while(true) {
          const {value, done} = await reader.read();
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
                setText((prev) => prev + content)
              }
            } catch (e) {}
          });
        }

      }
    })()
  }, [])

  return (
      <div>
        <div>{text}</div>
      </div>
  );
}

export default App;
