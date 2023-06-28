import React, {useCallback, useEffect, useState} from 'react';

const API_KEY = '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'

function App() {
  const [text, setText] = useState<string>('response: ');
  const [content, setContent] = useState<string>('IT운영팀 구성원에 대해 알려줘');

  /**
   * 분석 요청할 데이터
   * @type {string}
   */
  // const content = `시그니처 암보험의 주계약에 대해 설명해줘.`
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
    아래는 IT운영팀 구성원 정보입니다. 물어보는 것을 아래 내용을 통해서만 답해주세요.
    
[
  {
    "성명:" : "신명철",
    "세부직무:" : "IT기획",
  },
  {
    "성명:" : "김창완",
    "세부직무:" : "서비스기획",
  },
  {
    "성명:" : "강준식",
    "세부직무:" : "프론트개발자",
  }
]
    `
    }
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
  }

  const onChange = useCallback((e: { target: { value: React.SetStateAction<string>; }; })=>{
    setContent(e.target.value);
  },[]);

  useEffect(() => {
    
  }, [])

  return (
      <>
        <div>
          <input type="text" style={{width: '500px'}} value={content} onChange={onChange} id="keywords" name="keywords" required />
          <button onClick={getRes}> 질문하기 </button>
        </div>
        <div>{text}</div>
      </>
  );
}

export default App;
