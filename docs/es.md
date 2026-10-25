# Google Maps Travel Time

## Presentación

Esta integración sigue sus trayectos habituales — casa-trabajo, colegio, aeropuerto — con la duración de Google Maps. Para cada trayecto da la duración con tráfico en tiempo real, el retraso causado por el tráfico, la distancia y las vías principales, y puede lanzar sus escenas cuando el tráfico empeora o cambia la ruta.

- Cada trayecto se convierte en un **dispositivo**: duración, duración sin tráfico y retraso por tráfico (coche y moto), distancia, vías principales.
- Los trayectos se miden **solo en sus días y horas**, para que las solicitudes queden dentro del uso mensual gratuito de Google.
- **Disparadores de escena**: la ruta de un trayecto cambia, el presupuesto del mes está casi gastado, Google rechaza la clave de API. **Acciones de escena**: calcular una ruta ahora, medir un trayecto ahora.
- Tres **widgets de panel**: los tiempos de los trayectos, un trayecto, las solicitudes del mes.

![Los tres widgets de la integración: tiempos de trayecto, un trayecto y solicitudes del mes (ilustración generada, no una captura de pantalla)](https://raw.githubusercontent.com/William-De71/gladys-google-maps-travel-time/main/docs/assets/widgets.es.png)

La imagen de arriba es una ilustración generada, no una captura de pantalla. Sin relación con Google; todavía no probada con una clave de API real.

## Requisitos

- Gladys Assistant 5.3.0 o posterior.
- Una **clave de API de Google Maps Platform**:
  1. En la [consola de Google Cloud](https://console.cloud.google.com/), cree un proyecto (o elija uno) y vincúlele una **cuenta de facturación**: Google la exige aunque se quede en el uso gratuito.
  2. Active la **Routes API** (API y servicios → Biblioteca → «Routes API»).
  3. Cree una **clave de API** (Google Maps Platform → Claves y credenciales) y restrínjala a la Routes API. Una restricción por dirección IP solo funciona si la dirección IP pública de su Gladys es fija.
- La zona horaria de Gladys bien configurada (**Ajustes > Sistema**): las horas de los trayectos se leen en ella.

**Coste.** Google factura cada solicitud correcta más allá de un uso mensual gratuito por tipo de solicitud: 5000 solicitudes en coche con tráfico en tiempo real («Pro»), 1000 en moto o scooter («Enterprise»), 10 000 en bicicleta, a pie o en transporte público («Essentials»). Un trayecto en coche medido cada 15 minutos de 6:00 a 21:00, de lunes a viernes, usa unas 1300 solicitudes al mes. La integración se queda por defecto bajo el 90 % de cada uso gratuito y mide los trayectos con menos frecuencia antes que superarlo. El uso gratuito pertenece a la cuenta de facturación: los otros usos de la cuenta también cuentan.

## Configuración

Los trayectos no se escriben en JSON: cada uno es un pequeño formulario, tras los botones al final de la página de configuración.

| Campo o botón                        | Descripción                                                                                                                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clave de API de Google Maps Platform | Obligatoria. Gladys la guarda en secreto, nunca la vuelve a mostrar ni la escribe en los registros.                                                                                                   |
| Intervalo por defecto                | Minutos entre dos medidas de un trayecto sin intervalo propio (5 a 240, 15 por defecto).                                                                                                              |
| Umbral de retraso por defecto        | Retraso por tráfico, en minutos, desde el que un trayecto se muestra en rojo en los widgets (naranja desde 3 minutos). 10 por defecto.                                                                |
| Presupuesto mensual                  | Parte del uso gratuito de cada tipo de solicitud que la integración puede gastar. 90 por defecto; por encima de 100, Google factura las solicitudes adicionales.                                      |
| Idioma de los textos                 | Nombres de las funciones, descripciones de ruta, resúmenes de escena, mensajes de los botones. **Elíjalo antes de añadir sus dispositivos**: un dispositivo conserva los nombres con los que se creó. |
| Añadir un trayecto                   | Nombre, origen, destino, modo de transporte, evitar peajes / autopistas / ferris, días, horas («6-10, 16-20», vacío: 6-21), intervalo y umbral propios.                                               |
| Modificar un trayecto                | El trayecto por su nombre o su número (#2); solo cambian los campos que rellene. 0 devuelve el intervalo o el umbral al valor por defecto.                                                            |
| Eliminar un trayecto                 | El trayecto por su nombre o su número. Su dispositivo permanece en Gladys hasta que lo elimine.                                                                                                       |
| Listar los trayectos                 | Cada trayecto con su horario, las solicitudes previstas, su última medida y su último error, y las solicitudes del mes.                                                                               |
| Probar la clave de API               | Calcula un paseo corto por París (una solicitud Essentials) y dice qué corregir si Google rechaza la clave.                                                                                           |

Origen y destino aceptan una dirección, un lugar («Lyon Part-Dieu»), un plus code o coordenadas «latitud, longitud» (como `45.7640, 4.8357`).

## Uso

### Trayectos

1. Pegue la clave de API y pulse **Probar la clave de API**.
2. Pulse **Añadir un trayecto** para cada trayecto habitual. Por defecto: en coche, de lunes a viernes de 6:00 a 21:00, cada 15 minutos; adapte los días y las horas a lo que necesite.
3. La primera medida llega en un minuto si el trayecto está dentro de sus horas. Fuera de ellas, el trayecto conserva su última medida.

### Dispositivos

Abra la pestaña **Descubrir** y añada los trayectos que quiera. Cada dispositivo tiene:

- **Duración con tráfico** (minutos; «Duración» en bicicleta, a pie y en transporte público);
- **Duración sin tráfico** y **Retraso por tráfico** (minutos; coche y moto);
- **Distancia** (km) y **Ruta** (las vías principales, como «A6»).

Los valores siguen las medidas del trayecto; Gladys guarda su historial.

### Widgets del panel

- **Tiempos de trayecto**: los trayectos con duración, distancia y vías, una insignia de retraso (verde, naranja desde 3 minutos, roja desde el umbral del trayecto), un enlace a la ruta en Google Maps y **Actualizar todo**.
- **Trayecto**: un trayecto elegido entre los dispositivos: cuatro mosaicos, ruta, última medida, **Actualizar**.
- **Solicitudes Google Maps**: un indicador por tipo de solicitud usado, lo que los trayectos prevén al mes, el estado de la clave.

Un botón de actualizar gasta una solicitud por trayecto, ninguna para un trayecto medido hace menos de un minuto.

### Escenas

Disparadores de la integración:

- **La ruta de un trayecto cambia**: en una medida programada, la ruta más rápida pasa por otras vías que en la anterior. Variables: nombre, ruta, ruta anterior, duración, retraso, distancia, frase de resumen.
- **El presupuesto del mes está casi gastado**: un tipo de solicitud llega al 80 % y luego al 100 % de su presupuesto (una vez cada uno al mes).
- **Google rechaza la clave de API**: una vez, hasta que una solicitud vuelva a funcionar; el resumen dice qué corregir.

Para un umbral («el retraso supera 10 minutos», «la duración supera 40 minutos»), use el **disparador de dispositivo** de Gladys sobre la función del trayecto.

Acciones: **Calcular una ruta** (dos lugares cualesquiera, ahora) y **Medir un trayecto ahora** (también fuera de sus horas). Ambas devuelven la duración, la duración sin tráfico, el retraso, la distancia, la ruta y una frase de resumen como «Trabajo: 38 min, 14 min de tráfico, 11,8 km por M6.» para enviar en un mensaje.

Ejemplos:

- Cuando el retraso por tráfico de «Trabajo» supera 10 minutos → enviar el resumen del trayecto.
- Cada día laborable a las 7:15 → medir «Trabajo» ahora → enviar `{{0.0.summary}}` a la familia.

### Transporte

La integración usa los servidores de Google (nube): **las direcciones de sus trayectos se envían a Google** en cada medida, con su clave de API. Los trayectos se guardan en la configuración de Gladys; las últimas medidas y el contador de solicitudes, en el volumen `/data` de la integración.

## Solución de problemas

- **«Google rechaza la clave de API»**: el mensaje da el motivo de Google. `API_KEY_INVALID`: vuelva a copiar la clave. `SERVICE_DISABLED`: active la Routes API en el proyecto de la clave. `BILLING_DISABLED`: vincule una cuenta de facturación. `API_KEY_SERVICE_BLOCKED`: añada la Routes API a las API permitidas de la clave. Una restricción por IP rechaza a Gladys si su dirección pública ha cambiado. La integración lo vuelve a intentar cada hora, y enseguida tras **Probar la clave de API** o una clave nueva.
- **Un trayecto no tiene ninguna medida**: compruebe sus días y horas con **Listar los trayectos** (la zona horaria mostrada debe ser la suya) y su último error: «Google no encontró ninguna ruta» indica una dirección que Google no sabe situar, o un modo de transporte no disponible allí.
- **Medidas más espaciadas que el intervalo**: «alargado … para no salir del presupuesto» en **Listar los trayectos** significa que los trayectos de ese tipo de solicitud prevén más que el presupuesto; reduzca las horas, los trayectos o el intervalo, o aumente el presupuesto.
- **«Se han usado las solicitudes del mes»**: se ha alcanzado el presupuesto de ese tipo de solicitud; los trayectos afectados esperan al mes siguiente (UTC). La cuenta de Google (consola de Cloud → Google Maps Platform → Métricas) es la que vale.
- **429**: Google limita las solicitudes de la clave; la integración espera 15 minutos.
- Para informar de un problema, indique las versiones de Gladys y de la integración, el texto de **Listar los trayectos** (oculte sus direcciones si quiere) y los registros de la integración (Ajustes → Supervisión). No pegue nunca su clave de API.
