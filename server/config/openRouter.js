const openRouterUrl="https://openrouter.ai/api/v1/chat/completions"
const model="deepseek/deepseek-chat"

export const generateResponse = async(prompt)=>{
    if(!process.env.OPENROUTER_API_KEY){
        throw new Error("OPENROUTER_API_KEY is missing")
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000);

    try{
    const res= await fetch(openRouterUrl, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: model,
    messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature:0.2
  }),
  signal: controller.signal,
});

if(!res.ok){
    const err=await res.text();
    throw new Error(err);

}
const data=await res.json();
return data.choices[0].message.content;
    }catch(error){
      if(error.name === "AbortError"){
        throw new Error("AI request timed out. Please try again.");
      }
      throw error;
    }finally{
      clearTimeout(timeout);
    }

}
