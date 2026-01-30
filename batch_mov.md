# Batch de movimientos 

Se necesita implementar la lógica de un batch de movimientos que 
debe informar a Interbank los cambios de estado de las solicitudes 
de entrega (tarjetas) agrupadas en packs, mediante archivos planos 
con nombre, estructura y reglas muy estrictas.

## 1. Entendimiento del problema

- Corre 4 veces al día (06:00, 11:30, 13:30, 18:30), todos los días.
- Debe generar y depositar archivos de movimientos en un SFTP del banco 
15 minutos antes de cada turno.

Además,

- El turno 1 debe incluir todas las gestiones no reportadas del día anterior.
- Turnos posteriores: gestiones del día en curso y regularizaciones.
- En caso de errores, Interbank envía un reporte (Anexo 4 del excel); esos 
errores deben corregirse en el siguiente turno.

## 2. Puntos Clave en logica

- Definir qué criterio marca un **“movimiento pendiente de reportar”**.
- **Filtrar por fecha/turno:**

  - **Turno 1:** todas las gestiones pendientes del día anterior + primeras del día actual.
  - **Turnos 2, 3, 4:** solo gestiones del día actual y regularizaciones.

- Asegurarse de que todas las solicitudes del pack tengan el mismo movimiento por visita:

  - Si faltan solicitudes no incluir ese pack en el batch.

- Aplicar reglas por **tipo de movimiento:**
  - Si movimiento proviene de coordinación de Banco / Courier:

    ```
    Tipo Visita = 1:En frío / 2:Coordinada
    Tipo de entrega = T:Titular, A:Tercero, S:Simple=S
    Código Coordinación = CC + AAAAMMDD +10 digitos por fecha
    ```
  - Si es visita sin coordinación:

    ```
    Tipo Visita = 1:En frío / 2:Coordinada
    Tipo de entrega = T:Titular, A:Tercero, S:Simple=S
    ```

- Resolver la **lógica de dirección**
  - Si la entrega es en la dirección del Banco:
    ```
    # Mismo recibido en la creacion 
    # y dejar vacíos campos 17–26.
    ID Dirección = 1 
    ```
  - Si la entrega es en dirección alterna:
    - Regla de negocio:
      - Si hay Número de vía → Mz/Lote pueden ser vacíos.
      - Si no hay Número de vía → Mz y Lote son obligatorios y van juntos.

    ```
    ID Dirección = 0 
    # Completar campos 17–26 (Tipo Dirección, 
    # Tipo/Vía, Nombre vía, Número, Mz/Lote, etc.).
    ```

- **Construir el archivo (cabecera + detalle)** respetando formato
  - Construir nombre: MOVIB<YYYYMMDD>_<Nemónico>_<TT>.TXT.
  - TT = turno (“01”, “02”, “03”, “04”).
  - Verificar que el archivo sea generado y subido al SFTP antes de la hora límite (15 min antes del turno banco).
  - Generar cabecera:

    - Nemónico Courier (ej. CZK).
    - Fecha envío (YYYYMMDD).
    - Hora envío (HH:mm).
    - Número de registros (cantidad de líneas detalle).
    - Espacio reservado hasta longitud fija (859 caract.).

  - Generar detalle por movimiento y solicitud:

    - Mapear cada campo de negocio a los 29 campos definidos.
    - Convertir a texto y respetar longitudes, padding y codificación UTF-8.
    - Ordenar por número de solicitud en forma ascendente dentro del pack y globalmente.

  - Asegurarse que el conteo de registros de cabecera = número real de líneas detalle.

- **Validaciones contra catálogos y datos maestros**:
  - Validar consistencia:

    - ID Plástico debe existir y estar asociado al Pack y al Punto de Destino correcto.
    - ID de punto de destino coincide con maestro de almacenes.
    - Tipo entrega compatible con la última coordinación del pack (o Titular si no hay coordinación).

- **Reglas de corrección (Reacción 0054)**

  - Detectar casos donde se deba “revertir” un movimiento previamente mal informado.

  - Generar, para cada pack:

    1. Registro del movimiento errado, reemplazando:

      ```
      Situación = “013”
      Ubicación = “002”
      Reacción = “0054”
      ```

    2. Inmediatamente después, registro con el movimiento correcto.

  - Ambos bloques deben repetirse para todas las solicitudes del pack.

- **Reintentos operativos**, si falla la conexión al SFTP:

  - Reintentos controlados.
  - Si persiste, levantar alerta e instrucción de escalar con Banco.

- **Notificaciones y coordinación con Banco**

  - Al finalizar un envío correcto:

    - Disparar correo a equipo Distribución con:

        - Nombre del archivo.
        - Turno.
        - Hora de carga.

  - Cuando Interbank envíe reporte de errores:

    - El Pack completo deberá ser considerado en la corrección.
    - Se deberán generar dos bloques consecutivos de movimientos dentro del mismo archivo:

      - **Bloque 1:** Movimiento errado (anulación lógica)

        - Se replica el movimiento previamente enviado, pero reemplazando obligatoriamente los valores:
          ```   
          Situación: 013
          Ubicación: 002
          Reacción: 0054
          ```
        - Este bloque indica al Banco que el movimiento anterior debe considerarse inválido.

      - **Bloque 2:** Movimiento correcto

        - Se registra inmediatamente después el movimiento con los datos correctos reales del nuevo estado.

        - El orden de los registros es obligatorio:

          - Primero todos los registros errados del Pack.

          - Luego todos los registros corregidos del Pack.

          - Respetando el orden ascendente por ID de Solicitud.

    - Ambos bloques deben cumplir todas las validaciones estándar

## 3. Homologacion de estados (reacciones)


| COD. REACCIÓN | COD. SITUACIÓN | COD. UBICACIÓN | REACCIÓN                        | ESTADO | ESTADO DALI           | MOTIVO                         |
|--------------:|---------------:|---------------:|---------------------------------|:------:|------------------------|--------------------------------|
| 0005          | 001            | 002            | TITULAR AUSENTE                 | A      | Intento de entrega     | nadie en domicilio             |
| 0014          | 002            | 002            | DIRECCIÓN ERRADA                | A      | Intento de entrega     | problema con la dirección      |
| 0024          | 002            | 002            | ZONA PELIGROSA                  | A      | Intento de entrega     | Domicilio no visitado          |
| 0025          | 003            | 003            | ENTREGADO                       | A      | Entregado              | —                              |
| 0029          | 004            | 001            | ENTREGADA A DISTRIBUCIÓN PRUEBAS| A      | —                      | —                              |
| 0031          | 002            | 000            | ROBADO / PERDIDO                | A      | Siniestrado            | —                              |
| 0036          | 008            | 002            | RECHAZO - DESISTE DEL PRODUCTO  | A      | —                      | —                              |
