export function mapApiError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Gemini quota
    if (message.includes('too many requests') || message.includes('quota')) {
      return 'Has superado tu límite diario de uso gratuito. Por favor, inténtalo mañana o revisa tu cuenta.';
    }

    // Gemini model not found
    if (message.includes('not found') && message.includes('model')) {
      return 'El modelo solicitado no está disponible. Revisa la configuración.';
    }

    // OpenAI quota
    if (message.includes('insufficient_quota')) {
      return 'Has superado tu cuota de uso en OpenAI. Revisa tu plan de facturación.';
    }

    // OpenAI authentication
    if (message.includes('unauthorized')) {
      return 'Error de autenticación con OpenAI. Verifica tu API Key.';
    }

    // Default fallback
    return 'Ha ocurrido un error inesperado al procesar tu solicitud.';
  }

  return 'Error desconocido.';
}
