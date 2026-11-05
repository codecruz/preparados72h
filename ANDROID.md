# Preparados72h para Android

App Android hecha con [Capacitor 8](https://capacitorjs.com/) que empaqueta la web de `portal/`. Todo va dentro del APK, así que funciona sin conexión desde que se instala.

## Funciones propias de la app
- **Compartir** el plan familiar, la checklist o el resultado de la calculadora con el menú de Android (WhatsApp, correo, Drive…). Sustituye a «Imprimir».
- **Notificación local** 6 meses después de pulsar «He revisado la mochila hoy».
- **Botón SOS** con 112 y 911 (abre el marcador del teléfono).
- **Sin sección de noticias:** dentro del APK no se actualizarían, así que solo se muestran en la web.

## Cómo se compila
`.github/workflows/android.yml` se ejecuta con cada push que toca `portal/`, `android/` o la configuración de Capacitor, y también a mano desde *Actions*. El proceso:
1. Ejecuta `npx cap sync android`.
2. Compila con Gradle.
3. Publica el APK como **release** (`android-v0.1.N`), que se puede descargar desde el móvil.

### Firma
- **Sin secretos:** se genera un APK de **depuración**. Funciona, pero para instalar una versión nueva hay que desinstalar antes la anterior.
- **Con secretos:** se genera un APK de **release** firmado, y las actualizaciones se instalan encima. Para activarlo, sube la clave generada en `~/.config/preparados72h/` (no está en el repo; **haz copia de seguridad**: sin ella no podrás actualizar la app firmada):

```bash
base64 -w0 ~/.config/preparados72h/release.jks | gh secret set ANDROID_KEYSTORE_B64 -R codecruz/preparados72h
sed -n 's/^Password: //p' ~/.config/preparados72h/KEYSTORE-INFO.txt | gh secret set ANDROID_KEYSTORE_PASSWORD -R codecruz/preparados72h
```

## Desarrollo local
```bash
npm ci
npx cap sync android      # copia portal/ en android/
npx cap open android      # abre Android Studio (requiere el SDK de Android)
```
