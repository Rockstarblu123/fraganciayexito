import openai
import os
from dotenv import load_dotenv
import dotenv # Importar la librería dotenv completa para usar find_dotenv

# --- DEBUG: Mostrar el valor de la variable ANTES de cargar .env ---
# Esto nos dirá si la variable ya existe en el entorno del proceso al iniciar el script
openrouter_api_key_before_load = os.environ.get("OPENROUTER_API_KEY")
if openrouter_api_key_before_load:
    print(f"DEBUG BEFORE LOAD_DOTENV: Clave API de OpenRouter es: {openrouter_api_key_before_load[:5]}...{openrouter_api_key_before_load[-5:]}")
else:
    print("DEBUG BEFORE LOAD_DOTENV: Clave API de OpenRouter NO está configurada en el entorno inicial.")


# --- DEBUG: Mostrar dónde busca .env ---
print("DEBUG: Buscando archivo .env...")
dotenv_path = dotenv.find_dotenv()
if dotenv_path:
    print(f"DEBUG: Archivo .env encontrado en: {dotenv_path}")
else:
    print("DEBUG: Archivo .env NO encontrado. Asegúrate de que esté en la misma carpeta que el script o en una superior.")

# --- CARGAR VARIABLES DEL ARCHIVO .env ---
print("DEBUG: Intentando cargar variables desde .env con override=True...")
# load_dotenv(dotenv_path) # Comentamos esta línea temporalmente para la depuración
# Vamos a cargar sin especificar la ruta, pero FORZANDO la sobreescritura
load_dotenv(override=True) # <--- ¡Añadimos override=True aquí!


# --- DEBUG: Mostrar el valor de la variable DESPUÉS de cargar .env ---
# Esto nos dirá si load_dotenv logró sobreescribir un valor existente o cargar uno nuevo
openrouter_api_key_after_load = os.environ.get("OPENROUTER_API_KEY")
if openrouter_api_key_after_load:
    # Mostramos solo una parte para no exponer la clave completa en la salida
    print(f"DEBUG AFTER LOAD_DOTENV: Clave API de OpenRouter es: {openrouter_api_key_after_load[:5]}...{openrouter_api_key_after_load[-5:]}")
else:
    print("DEBUG AFTER LOAD_DOTENV: Clave API de OpenRouter sigue SIN estar cargada.")


# --- CONFIGURACIÓN DE LA API ---
# 1. Obtener la clave API de OpenRouter. Usamos el valor que acabamos de verificar.
openrouter_api_key = openrouter_api_key_after_load # Usamos el valor obtenido DESPUÉS de load_dotenv

# 2. Definir la URL base de la API de OpenRouter
openrouter_base_url = "https://openrouter.ai/api/v1/"

# 3. Elige el nombre EXACTO del modelo gratuito
modelo_a_usar = "nousresearch/deephermes-3-mistral-24b-preview:free" # <-- Verifica que este modelo siga siendo gratuito

# --- VERIFICACIÓN DE LA CLAVE API ANTES DE USARLA ---
if not openrouter_api_key:
    print("\n--- ERROR CRÍTICO ---")
    print("La clave API de OpenRouter no está disponible.")
    print("Por favor, revisa los mensajes DEBUG anteriores y asegúrate de que el archivo .env")
    print("esté en la ubicación correcta y contenga la clave OPENROUTER_API_KEY=tu_clave.")
    print("Asegúrate también de ejecutar el script DESPUÉS de activar el entorno virtual si usas uno.")
    print("---------------------\n")
    exit()

# --- INICIALIZACIÓN DEL CHAT ---
print("--- Chat con IA (usando OpenRouter) ---")
print(f"Modelo seleccionado: {modelo_a_usar}")
print("Escribe 'salir' para terminar el chat.")
print("-------------------------------------")

# Lista para mantener el historial de la conversación
mensajes_conversacion = []

# --- BUCLE PRINCIPAL DEL CHAT ---
while True:
    try:
        user_input = input("-(TU): ")

        if user_input.lower() == "salir":
            break

        mensajes_conversacion.append({"role": "user", "content": user_input})

        # 4. Configurar la librería openai para usar OpenRouter
        openai.base_url = openrouter_base_url
        openai.api_key = openrouter_api_key # Usamos la clave que ya verificamos que existe

        # --- DEBUG: Mostrar la clave EXACTA que se va a usar en la llamada ---
        print(f"DEBUG BEFORE API CALL: openai.api_key is set to: {openai.api_key[:5]}...{openai.api_key[-5:]}")


        # 5. Llamar a la API de OpenRouter para obtener una respuesta
        print("DEBUG: Enviando petición a la API...")
        respuesta = openai.chat.completions.create(
            model=modelo_a_usar,
            messages=mensajes_conversacion
        )
        print("DEBUG: Petición a la API completada.")

        # 6. Extraer el texto de la respuesta de la IA
        if respuesta and respuesta.choices and len(respuesta.choices) > 0:
            ai_response_content = respuesta.choices[0].message.content
        else:
            ai_response_content = "Error: No se recibió una respuesta válida de la IA."
            print(f"DEBUG: Respuesta completa de la API vacía o inválida: {respuesta}")

        # 7. Imprimir la respuesta de la IA
        print(f"-(IA): {ai_response_content}")

        # 8. Añadir la respuesta de la IA al historial
        mensajes_conversacion.append({"role": "assistant", "content": ai_response_content})

    except openai.APIError as e:
        print(f"Error al comunicarse con la API de OpenRouter: {e}")

    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

# --- FIN DEL CHAT ---
print("-------------------------------------")
print("Chat terminado. ¡Hasta luego!")
print("-------------------------------------")
