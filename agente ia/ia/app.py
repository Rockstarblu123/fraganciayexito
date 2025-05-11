from openai import OpenAI

client = OpenAI(api_key="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",
base_url="https://openrouter.ai/api/v1")

chat = client.chat.completions.create(
    model="DeepSeek:R1 (free)",
    messages=[  
        {
            "role": "user",  
            "content": "cuantas 'r' tiene la palabra 'pararrollador'"  # Coma añadida y palabra corregida
        }
    ]
)


print(chat)
print(chat.choice[0].message.content)