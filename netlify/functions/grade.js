export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { imageData, question, answer, hint, grade, type } = body;

  const prompt = `당신은 초등학교 ${grade}학년 학생의 답안을 채점하는 선생님입니다.

문제 유형: ${type}
문제: "${question}"
정답(또는 가능한 답): "${answer}"
힌트: "${hint}"

이미지에서 아이가 손으로 쓴 답안을 읽고 채점해주세요.

채점 기준:
- 수학: 숫자값이 맞으면 정답 (단위/표기 방식 약간 달라도 OK)
- 영어단어: 대소문자 무시, 철자가 맞으면 정답
- 영어문법: 핵심 답이 포함되면 정답
- 패턴/논리: 올바른 값이면 정답
- 복수 정답: 쉼표로 구분된 경우 모두 맞으면 정답, 하나만 맞으면 부분 인정

반드시 아래 JSON만 반환하세요 (마크다운 없이):
{
  "recognized": "이미지에서 읽은 내용",
  "correct": true 또는 false,
  "feedback": "아이에게 보내는 메시지 (한국어, ${grade}학년 수준, 1~2문장, 따뜻하고 격려하는 톤)",
  "explanation": "틀렸을 경우 핵심 풀이 설명 (한국어, 1~2문장, 맞으면 빈 문자열)"
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageData } },
            { type: "text", text: prompt }
          ]
        }]
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message || "API error" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const text = data.content?.map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { recognized: "(인식됨)", correct: false, feedback: "다시 한번 써봐요!", explanation: "" };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/grade" };
