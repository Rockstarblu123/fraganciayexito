import openai # Importamos la librería que instalamos
import os     # Importamos la librería para leer variables de entorno
from dotenv import load_dotenv

# --- CONFIGURACIÓN ---
# 1. Obtener la clave API de OpenRouter desde la variable de entorno
#    Esto es SEGURO porque la clave no está escrita directamente en el código
openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")

# 2. Definir la URL base de la API de OpenRouter
#    Le decimos a la librería 'openai' que hable con este servidor
openrouter_base_url = "https://openrouter.ai/api/v1/"

# 3. ¡Elige el nombre EXACTO del modelo gratuito que encontraste en el Paso 2!
#    Reemplaza "nombre/del/modelo/gratis/aqui" con el nombre real.
modelo_a_usar = "nousresearch/deephermes-3-mistral-24b-preview:free" # <-- ¡CAMBIA ESTO!

# --- VERIFICACIÓN ---
# Asegurarnos de que tenemos la clave API
if not openrouter_api_key:
    print("Error: No se encontró la clave API de OpenRouter.")
    print("Por favor, configura la variable de entorno OPENROUTER_API_KEY (ver Paso 4).")
else:
    # --- USO DE LA API ---
    try:
        # Configurar la librería openai para usar OpenRouter
        openai.base_url = openrouter_base_url
        openai.api_key = openrouter_api_key

        # Preparar el mensaje que le enviaremos a la IA
        # "role": "user" significa que eres tú hablando
        # "content" es el texto de tu pregunta
        mensajes_para_ia = [
            {"role": "user", "content": "¿Puedes contarme un chiste corto?"}
        ]

        # Llamar a la API de OpenRouter para obtener una respuesta
        print(f"Enviando pregunta a la IA usando el modelo: {modelo_a_usar}...")

        respuesta = openai.chat.completions.create(
            model=modelo_a_usar,     # Usamos el nombre del modelo gratuito que elegimos
            messages=mensajes_para_ia # Le pasamos nuestra pregunta
        )

        # --- PROCESAR LA RESPUESTA ---
        # Extraer el texto de la respuesta de la IA
        # La respuesta viene en una estructura específica, accedemos al contenido
        texto_respuesta_ia = respuesta.choices[0].message.content

        # Imprimir la respuesta
        print("\nLa IA responde:")
        print(texto_respuesta_ia)

    except openai.APIError as e:
        # Manejar errores si algo salió mal con la petición a la API
        print(f"Error al comunicarse con la API de OpenRouter: {e}")
    except Exception as e:
        # Manejar cualquier otro tipo de error
        print(f"Ocurrió un error inesperado: {e}")

print("\n--- Fin del programa ---")