import React, { useCallback, useEffect, useState } from 'react';

const API_KEY = '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'

function App() {
  const [text, setText] = useState<string>('response: ');
  const [content, setContent] = useState<string>('IT운영팀 구성원에 대해 알려줘');

  /**
   * 분석 요청할 데이터
   * @type {string}
   */
  // const content = `시그니처 암보험의 주계약에 대해 설명해줘.`
  const getRes = () => {
    setText('');
    // async function
    (async () => {
      // GPT API 호출
      const response = await fetch('https://hanwha.llmapps.apistage.ai/chat', {
        method: 'post',
        mode: 'cors',
        headers: {
          "X-API-Key" : "zR2su0OWgM40GZkXfaqC8P94UTeX5tXaH7ObhBPd",
          "Content-Type": "application/json",
          // Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          "conversation_id": "202307210847592230068#9323e90f-7edb-4353-a254-0bf372941c7f",
          "query": "납입면제 사유를 알려줘"
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
          //debugger;
          // 응답 처리
          // new TextDecoder().decode(value).split('data: ').forEach((decoded) => {
          //   try {
          //     // char 단위로 state에 삽입
          //     const content = JSON.parse(decoded).choices[0].delta.content;
          //     if (content) {
          //       setText((prev) => prev + content)
          //     }
          //   } catch (e) { }
          // });

          setText((prev) => prev + new TextDecoder().decode(value));
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
        <input type="text" style={{ width: '500px' }} value={content} onChange={onChange} id="keywords" name="keywords" required />
        <button onClick={getRes}> 질문하기 </button>
      </div>
      <div>{text}</div>
    </>
  );
}

export default App;
