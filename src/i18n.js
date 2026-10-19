// -----------------------------------------------------------------------------
// Texts of the integration, in English, French, German and Spanish (English
// fallback).
//
// The manifest carries its own labels; these are the texts the code writes at
// runtime: feature names, widget contents, scene summaries, messages of the
// Configuration screen. Vocabulary of the Gladys interface: appareil / Gerät /
// dispositivo, scène / Szene / escena, Découverte / Entdecken / Descubrir.
// -----------------------------------------------------------------------------

const LANGUAGES = ['en', 'fr', 'de', 'es'];

const TEXTS = {
  // travel modes
  mode_drive: { en: 'Car', fr: 'Voiture', de: 'Auto', es: 'Coche' },
  mode_two_wheeler: {
    en: 'Motorcycle / scooter',
    fr: 'Moto / scooter',
    de: 'Motorrad / Roller',
    es: 'Moto / scooter',
  },
  mode_bicycle: { en: 'Bicycle', fr: 'Vélo', de: 'Fahrrad', es: 'Bicicleta' },
  mode_walk: { en: 'Walking', fr: 'À pied', de: 'Zu Fuß', es: 'A pie' },
  mode_transit: {
    en: 'Public transport',
    fr: 'Transports en commun',
    de: 'Öffentliche Verkehrsmittel',
    es: 'Transporte público',
  },
  days_every_day: { en: 'every day', fr: 'tous les jours', de: 'täglich', es: 'todos los días' },
  days_weekdays: {
    en: 'Monday to Friday',
    fr: 'du lundi au vendredi',
    de: 'Montag bis Freitag',
    es: 'de lunes a viernes',
  },
  days_weekend: {
    en: 'weekends',
    fr: 'le week-end',
    de: 'am Wochenende',
    es: 'los fines de semana',
  },
  days_mon_sat: {
    en: 'Monday to Saturday',
    fr: 'du lundi au samedi',
    de: 'Montag bis Samstag',
    es: 'de lunes a sábado',
  },
  sku_essentials: { en: 'Essentials', fr: 'Essentials', de: 'Essentials', es: 'Essentials' },
  sku_pro: { en: 'Pro', fr: 'Pro', de: 'Pro', es: 'Pro' },
  sku_enterprise: { en: 'Enterprise', fr: 'Enterprise', de: 'Enterprise', es: 'Enterprise' },

  // features
  featureDurationTraffic: {
    en: 'Travel time with traffic',
    fr: 'Durée avec trafic',
    de: 'Fahrzeit mit Verkehr',
    es: 'Duración con tráfico',
  },
  featureDuration: { en: 'Travel time', fr: 'Durée du trajet', de: 'Fahrzeit', es: 'Duración' },
  featureDurationNoTraffic: {
    en: 'Travel time without traffic',
    fr: 'Durée sans trafic',
    de: 'Fahrzeit ohne Verkehr',
    es: 'Duración sin tráfico',
  },
  featureDelay: {
    en: 'Traffic delay',
    fr: 'Retard dû au trafic',
    de: 'Verkehrsverzögerung',
    es: 'Retraso por tráfico',
  },
  featureDistance: { en: 'Distance', fr: 'Distance', de: 'Entfernung', es: 'Distancia' },
  featureRoute: { en: 'Route', fr: 'Itinéraire', de: 'Route', es: 'Ruta' },

  // units and times
  unitMin: { en: 'min', fr: 'min', de: 'Min.', es: 'min' },
  unitKm: { en: 'km', fr: 'km', de: 'km', es: 'km' },
  unitMi: { en: 'mi', fr: 'mi', de: 'mi', es: 'mi' },
  justNow: { en: 'just now', fr: 'à l’instant', de: 'gerade eben', es: 'ahora mismo' },
  minutesAgo: {
    en: '{n} min ago',
    fr: 'il y a {n} min',
    de: 'vor {n} Min.',
    es: 'hace {n} min',
  },
  hoursAgo: { en: '{n} h ago', fr: 'il y a {n} h', de: 'vor {n} Std.', es: 'hace {n} h' },
  daysAgo: { en: '{n} d ago', fr: 'il y a {n} j', de: 'vor {n} T.', es: 'hace {n} d' },
  never: { en: 'never', fr: 'jamais', de: 'nie', es: 'nunca' },
  viaRoute: { en: 'via {route}', fr: 'par {route}', de: 'über {route}', es: 'por {route}' },
  delayBadge: { en: '+{n} min', fr: '+{n} min', de: '+{n} Min.', es: '+{n} min' },
  onTime: { en: 'Fluid', fr: 'Fluide', de: 'Frei', es: 'Fluido' },
  offHours: { en: 'Off hours', fr: 'Hors plage', de: 'Außer Zeit', es: 'Fuera de hora' },
  noReading: { en: 'No reading', fr: 'Aucune mesure', de: 'Kein Wert', es: 'Sin dato' },

  // summaries (scene variables and outputs)
  summaryTraffic: {
    en: '{name}: {duration} min, {delay} min of traffic, {distance} km{route}.',
    fr: '{name} : {duration} min, dont {delay} min de trafic, {distance} km{route}.',
    de: '{name}: {duration} Min., davon {delay} Min. Verkehr, {distance} km{route}.',
    es: '{name}: {duration} min, {delay} min de tráfico, {distance} km{route}.',
  },
  summaryNoDelay: {
    en: '{name}: {duration} min, traffic is fluid, {distance} km{route}.',
    fr: '{name} : {duration} min, trafic fluide, {distance} km{route}.',
    de: '{name}: {duration} Min., freie Fahrt, {distance} km{route}.',
    es: '{name}: {duration} min, tráfico fluido, {distance} km{route}.',
  },
  summaryNoTraffic: {
    en: '{name}: {duration} min, {distance} km{route}.',
    fr: '{name} : {duration} min, {distance} km{route}.',
    de: '{name}: {duration} Min., {distance} km{route}.',
    es: '{name}: {duration} min, {distance} km{route}.',
  },
  summaryRouteSuffix: {
    en: ' via {route}',
    fr: ' par {route}',
    de: ' über {route}',
    es: ' por {route}',
  },
  routeChangedSummary: {
    en: '{name}: the fastest route now goes via {route} (was {previous}): {duration} min.',
    fr: '{name} : l’itinéraire le plus rapide passe maintenant par {route} (au lieu de {previous}) : {duration} min.',
    de: '{name}: Die schnellste Route führt jetzt über {route} (statt {previous}): {duration} Min.',
    es: '{name}: la ruta más rápida pasa ahora por {route} (antes {previous}): {duration} min.',
  },
  budgetWarningSummary: {
    en: 'Google Maps Travel Time: {used} of the {budget} {sku} requests of the month are used.',
    fr: 'Google Maps Travel Time : {used} des {budget} requêtes {sku} du mois sont utilisées.',
    de: 'Google Maps Travel Time: {used} der {budget} {sku}-Anfragen des Monats sind verbraucht.',
    es: 'Google Maps Travel Time: se han usado {used} de las {budget} solicitudes {sku} del mes.',
  },
  budgetExhaustedSummary: {
    en: 'Google Maps Travel Time: the {budget} {sku} requests of the month are used, the trips concerned wait for next month.',
    fr: 'Google Maps Travel Time : les {budget} requêtes {sku} du mois sont utilisées, les trajets concernés attendent le mois prochain.',
    de: 'Google Maps Travel Time: Die {budget} {sku}-Anfragen des Monats sind verbraucht, die betroffenen Strecken warten auf den nächsten Monat.',
    es: 'Google Maps Travel Time: se han usado las {budget} solicitudes {sku} del mes, los trayectos afectados esperan al mes que viene.',
  },
  apiErrorSummary: {
    en: 'Google Maps Travel Time: Google refuses the API key ({reason}). {hint}',
    fr: 'Google Maps Travel Time : Google refuse la clé d’API ({reason}). {hint}',
    de: 'Google Maps Travel Time: Google lehnt den API-Schlüssel ab ({reason}). {hint}',
    es: 'Google Maps Travel Time: Google rechaza la clave de API ({reason}). {hint}',
  },

  // what to do about a refused key
  hint_API_KEY_MISSING: {
    en: 'Type your Google Maps Platform API key in the configuration.',
    fr: 'Saisissez votre clé d’API Google Maps Platform dans la configuration.',
    de: 'Geben Sie Ihren Google-Maps-Platform-API-Schlüssel in der Konfiguration ein.',
    es: 'Escriba su clave de API de Google Maps Platform en la configuración.',
  },
  hint_API_KEY_INVALID: {
    en: 'Check the key: copy it again from the Google Cloud console.',
    fr: 'Vérifiez la clé : copiez-la de nouveau depuis la console Google Cloud.',
    de: 'Prüfen Sie den Schlüssel: Kopieren Sie ihn erneut aus der Google Cloud Console.',
    es: 'Compruebe la clave: cópiela de nuevo desde la consola de Google Cloud.',
  },
  hint_SERVICE_DISABLED: {
    en: 'Enable the “Routes API” in the Google Cloud project of the key.',
    fr: 'Activez la « Routes API » dans le projet Google Cloud de la clé.',
    de: 'Aktivieren Sie die „Routes API“ im Google-Cloud-Projekt des Schlüssels.',
    es: 'Active la «Routes API» en el proyecto de Google Cloud de la clave.',
  },
  hint_BILLING_DISABLED: {
    en: 'Link a billing account to the Google Cloud project (needed even within the free usage).',
    fr: 'Associez un compte de facturation au projet Google Cloud (nécessaire même dans l’usage gratuit).',
    de: 'Verknüpfen Sie ein Rechnungskonto mit dem Google-Cloud-Projekt (auch im kostenlosen Kontingent nötig).',
    es: 'Vincule una cuenta de facturación al proyecto de Google Cloud (necesaria incluso en el uso gratuito).',
  },
  hint_API_KEY_SERVICE_BLOCKED: {
    en: 'The restrictions of the key do not allow the Routes API: add it to the allowed APIs.',
    fr: 'Les restrictions de la clé n’autorisent pas la Routes API : ajoutez-la aux API autorisées.',
    de: 'Die Einschränkungen des Schlüssels erlauben die Routes API nicht: Fügen Sie sie den erlaubten APIs hinzu.',
    es: 'Las restricciones de la clave no permiten la Routes API: añádala a las API permitidas.',
  },
  hint_restricted: {
    en: 'The restrictions of the key (IP address, website, app) refuse Gladys: allow its public IP address, or remove them.',
    fr: 'Les restrictions de la clé (adresse IP, site, application) refusent Gladys : autorisez son adresse IP publique, ou retirez-les.',
    de: 'Die Einschränkungen des Schlüssels (IP-Adresse, Website, App) lehnen Gladys ab: Erlauben Sie ihre öffentliche IP-Adresse oder entfernen Sie sie.',
    es: 'Las restricciones de la clave (dirección IP, sitio, aplicación) rechazan a Gladys: permita su dirección IP pública o elimínelas.',
  },
  hint_default: {
    en: 'Check the key, the Routes API and the billing account of the Google Cloud project.',
    fr: 'Vérifiez la clé, la Routes API et le compte de facturation du projet Google Cloud.',
    de: 'Prüfen Sie den Schlüssel, die Routes API und das Rechnungskonto des Google-Cloud-Projekts.',
    es: 'Compruebe la clave, la Routes API y la cuenta de facturación del proyecto de Google Cloud.',
  },

  // connection status (Configuration screen)
  statusNoKey: {
    en: 'Type your Google Maps Platform API key, then add a trip with “Add a trip”.',
    fr: 'Saisissez votre clé d’API Google Maps Platform, puis ajoutez un trajet avec « Ajouter un trajet ».',
    de: 'Geben Sie Ihren Google-Maps-Platform-API-Schlüssel ein und fügen Sie dann mit „Strecke hinzufügen“ eine Strecke hinzu.',
    es: 'Escriba su clave de API de Google Maps Platform y añada un trayecto con «Añadir un trayecto».',
  },
  statusEmpty: {
    en: 'No trip yet: use “Add a trip”.',
    fr: 'Aucun trajet pour l’instant : utilisez « Ajouter un trajet ».',
    de: 'Noch keine Strecke: Verwenden Sie „Strecke hinzufügen“.',
    es: 'Todavía no hay trayectos: use «Añadir un trayecto».',
  },
  statusOk: {
    en: '{count} trip(s). This month: {usage}.',
    fr: '{count} trajet(s). Ce mois-ci : {usage}.',
    de: '{count} Strecke(n). Diesen Monat: {usage}.',
    es: '{count} trayecto(s). Este mes: {usage}.',
  },
  statusUsage: {
    en: '{used} / {budget} {sku} requests',
    fr: '{used} / {budget} requêtes {sku}',
    de: '{used} / {budget} {sku}-Anfragen',
    es: '{used} / {budget} solicitudes {sku}',
  },
  statusNoUsage: {
    en: 'no request yet',
    fr: 'aucune requête pour l’instant',
    de: 'noch keine Anfrage',
    es: 'ninguna solicitud todavía',
  },
  statusKeyError: {
    en: 'Google refuses the API key ({reason}). {hint}',
    fr: 'Google refuse la clé d’API ({reason}). {hint}',
    de: 'Google lehnt den API-Schlüssel ab ({reason}). {hint}',
    es: 'Google rechaza la clave de API ({reason}). {hint}',
  },

  // configuration buttons
  added: {
    en: 'Added: {line}\nNow open the Discover tab to add it as a device.',
    fr: 'Ajouté : {line}\nOuvrez maintenant l’onglet Découverte pour l’ajouter comme appareil.',
    de: 'Hinzugefügt: {line}\nÖffnen Sie jetzt den Tab Entdecken, um sie als Gerät hinzuzufügen.',
    es: 'Añadido: {line}\nAbra ahora la pestaña Descubrir para añadirlo como dispositivo.',
  },
  edited: {
    en: 'Changed: {line}',
    fr: 'Modifié : {line}',
    de: 'Geändert: {line}',
    es: 'Modificado: {line}',
  },
  editedFeatures: {
    en: '\nThe travel mode changes the features: click “Update” on the Discover tab.',
    fr: '\nLe mode de déplacement change les fonctionnalités : cliquez sur « Mettre à jour » dans l’onglet Découverte.',
    de: '\nDie Fortbewegungsart ändert die Funktionen: Klicken Sie im Tab Entdecken auf „Aktualisieren“.',
    es: '\nEl modo de transporte cambia las funciones: pulse «Actualizar» en la pestaña Descubrir.',
  },
  removed: {
    en: 'Removed: {name}. Its device stays in Gladys until you delete it.',
    fr: 'Supprimé : {name}. Son appareil reste dans Gladys jusqu’à ce que vous le supprimiez.',
    de: 'Entfernt: {name}. Sein Gerät bleibt in Gladys, bis Sie es löschen.',
    es: 'Eliminado: {name}. Su dispositivo permanece en Gladys hasta que lo elimine.',
  },
  listEmpty: {
    en: 'No trip yet: use “Add a trip”.',
    fr: 'Aucun trajet pour l’instant : utilisez « Ajouter un trajet ».',
    de: 'Noch keine Strecke: Verwenden Sie „Strecke hinzufügen“.',
    es: 'Todavía no hay trayectos: use «Añadir un trayecto».',
  },
  listHeader: {
    en: '{count} trip(s), timezone {timezone}. This month: {usage}.',
    fr: '{count} trajet(s), fuseau horaire {timezone}. Ce mois-ci : {usage}.',
    de: '{count} Strecke(n), Zeitzone {timezone}. Diesen Monat: {usage}.',
    es: '{count} trayecto(s), zona horaria {timezone}. Este mes: {usage}.',
  },
  listLine: {
    en: '#{n} {name} — {mode}{avoid}, {days}, {hours}, every {interval} min (≈ {planned} requests a month) — last reading: {last}',
    fr: '#{n} {name} — {mode}{avoid}, {days}, {hours}, toutes les {interval} min (≈ {planned} requêtes par mois) — dernière mesure : {last}',
    de: '#{n} {name} — {mode}{avoid}, {days}, {hours}, alle {interval} Min. (≈ {planned} Anfragen im Monat) — letzte Messung: {last}',
    es: '#{n} {name} — {mode}{avoid}, {days}, {hours}, cada {interval} min (≈ {planned} solicitudes al mes) — última medida: {last}',
  },
  listStretched: {
    en: ' (stretched from {interval} min to stay within the budget)',
    fr: ' (allongé depuis {interval} min pour rester dans le budget)',
    de: ' (von {interval} Min. gestreckt, um im Budget zu bleiben)',
    es: ' (alargado desde {interval} min para no salir del presupuesto)',
  },
  listError: {
    en: ' — last error: {message}',
    fr: ' — dernière erreur : {message}',
    de: ' — letzter Fehler: {message}',
    es: ' — último error: {message}',
  },
  avoidTolls: { en: 'no tolls', fr: 'sans péage', de: 'ohne Maut', es: 'sin peajes' },
  avoidHighways: {
    en: 'no motorways',
    fr: 'sans autoroute',
    de: 'ohne Autobahn',
    es: 'sin autopistas',
  },
  avoidFerries: { en: 'no ferries', fr: 'sans ferry', de: 'ohne Fähre', es: 'sin ferris' },
  testOk: {
    en: 'The key works. Test walk, Eiffel Tower → Louvre: {duration} min, {distance} km (1 {sku} request).',
    fr: 'La clé fonctionne. Trajet de test à pied, tour Eiffel → Louvre : {duration} min, {distance} km (1 requête {sku}).',
    de: 'Der Schlüssel funktioniert. Testweg zu Fuß, Eiffelturm → Louvre: {duration} Min., {distance} km (1 {sku}-Anfrage).',
    es: 'La clave funciona. Ruta de prueba a pie, torre Eiffel → Louvre: {duration} min, {distance} km (1 solicitud {sku}).',
  },

  // errors
  errorName: {
    en: 'The name is required (at most {max} characters).',
    fr: 'Le nom est obligatoire ({max} caractères au maximum).',
    de: 'Der Name ist erforderlich (höchstens {max} Zeichen).',
    es: 'El nombre es obligatorio ({max} caracteres como máximo).',
  },
  errorOrigin: {
    en: 'The starting point is required (an address or “latitude, longitude”, at most {max} characters).',
    fr: 'Le départ est obligatoire (une adresse ou « latitude, longitude », {max} caractères au maximum).',
    de: 'Der Startpunkt ist erforderlich (eine Adresse oder „Breite, Länge“, höchstens {max} Zeichen).',
    es: 'El origen es obligatorio (una dirección o «latitud, longitud», {max} caracteres como máximo).',
  },
  errorDestination: {
    en: 'The destination is required (an address or “latitude, longitude”, at most {max} characters).',
    fr: 'L’arrivée est obligatoire (une adresse ou « latitude, longitude », {max} caractères au maximum).',
    de: 'Das Ziel ist erforderlich (eine Adresse oder „Breite, Länge“, höchstens {max} Zeichen).',
    es: 'El destino es obligatorio (una dirección o «latitud, longitud», {max} caracteres como máximo).',
  },
  errorSamePlace: {
    en: 'The starting point and the destination are the same.',
    fr: 'Le départ et l’arrivée sont identiques.',
    de: 'Startpunkt und Ziel sind gleich.',
    es: 'El origen y el destino son iguales.',
  },
  errorChoice: {
    en: 'Unknown choice: {value}.',
    fr: 'Choix inconnu : {value}.',
    de: 'Unbekannte Auswahl: {value}.',
    es: 'Opción desconocida: {value}.',
  },
  errorHours: {
    en: 'Hours not understood: write ranges such as “6-10, 16-20” or “7:30-9” (four at most; “0-24”: all day).',
    fr: 'Heures non comprises : écrivez des plages comme « 6-10, 16-20 » ou « 7:30-9 » (quatre au maximum ; « 0-24 » : toute la journée).',
    de: 'Uhrzeiten nicht verstanden: Schreiben Sie Bereiche wie „6-10, 16-20“ oder „7:30-9“ (höchstens vier; „0-24“: ganzer Tag).',
    es: 'Horas no entendidas: escriba franjas como «6-10, 16-20» o «7:30-9» (cuatro como máximo; «0-24»: todo el día).',
  },
  errorInterval: {
    en: 'The interval is a whole number of minutes from {min} to {max}.',
    fr: 'L’intervalle est un nombre entier de minutes de {min} à {max}.',
    de: 'Das Intervall ist eine ganze Zahl von Minuten von {min} bis {max}.',
    es: 'El intervalo es un número entero de minutos de {min} a {max}.',
  },
  errorThreshold: {
    en: 'The delay threshold is a whole number of minutes from {min} to {max}.',
    fr: 'Le seuil de retard est un nombre entier de minutes de {min} à {max}.',
    de: 'Die Verzögerungsschwelle ist eine ganze Zahl von Minuten von {min} bis {max}.',
    es: 'El umbral de retraso es un número entero de minutos de {min} a {max}.',
  },
  errorTarget: {
    en: 'Which trip? Type its name or its number (#2).',
    fr: 'Quel trajet ? Saisissez son nom ou son numéro (#2).',
    de: 'Welche Strecke? Geben Sie ihren Namen oder ihre Nummer ein (#2).',
    es: '¿Qué trayecto? Escriba su nombre o su número (#2).',
  },
  errorAmbiguous: {
    en: 'Several trips are called “{query}”: use their number ({numbers}).',
    fr: 'Plusieurs trajets s’appellent « {query} » : utilisez leur numéro ({numbers}).',
    de: 'Mehrere Strecken heißen „{query}“: Verwenden Sie ihre Nummer ({numbers}).',
    es: 'Varios trayectos se llaman «{query}»: use su número ({numbers}).',
  },
  errorNotFound: {
    en: 'No trip “{query}”: see “List the trips”.',
    fr: 'Aucun trajet « {query} » : voir « Lister les trajets ».',
    de: 'Keine Strecke „{query}“: siehe „Strecken auflisten“.',
    es: 'Ningún trayecto «{query}»: vea «Listar los trayectos».',
  },
  errorFull: {
    en: 'At most {max} trips.',
    fr: '{max} trajets au maximum.',
    de: 'Höchstens {max} Strecken.',
    es: '{max} trayectos como máximo.',
  },
  errorSave: {
    en: 'Gladys could not save the trips: {message}',
    fr: 'Gladys n’a pas pu enregistrer les trajets : {message}',
    de: 'Gladys konnte die Strecken nicht speichern: {message}',
    es: 'Gladys no pudo guardar los trayectos: {message}',
  },
  errorBudget: {
    en: 'The {budget} {sku} requests of the month are used: next readings next month (or raise the budget in the configuration).',
    fr: 'Les {budget} requêtes {sku} du mois sont utilisées : prochaines mesures le mois prochain (ou augmentez le budget dans la configuration).',
    de: 'Die {budget} {sku}-Anfragen des Monats sind verbraucht: nächste Messungen im nächsten Monat (oder erhöhen Sie das Budget in der Konfiguration).',
    es: 'Se han usado las {budget} solicitudes {sku} del mes: próximas medidas el mes que viene (o aumente el presupuesto en la configuración).',
  },
  errorTrip: {
    en: 'Google found no route for this trip: check the addresses and the travel mode ({message}).',
    fr: 'Google n’a trouvé aucun itinéraire pour ce trajet : vérifiez les adresses et le mode de déplacement ({message}).',
    de: 'Google hat keine Route für diese Strecke gefunden: Prüfen Sie die Adressen und die Fortbewegungsart ({message}).',
    es: 'Google no encontró ninguna ruta para este trayecto: compruebe las direcciones y el modo de transporte ({message}).',
  },
  errorQuota: {
    en: 'Google limits the requests of the key (429): the integration waits 15 minutes.',
    fr: 'Google limite les requêtes de la clé (429) : l’intégration attend 15 minutes.',
    de: 'Google begrenzt die Anfragen des Schlüssels (429): Die Integration wartet 15 Minuten.',
    es: 'Google limita las solicitudes de la clave (429): la integración espera 15 minutos.',
  },
  errorUnreachable: {
    en: 'Google Maps cannot be reached: {message}',
    fr: 'Google Maps est injoignable : {message}',
    de: 'Google Maps ist nicht erreichbar: {message}',
    es: 'No se puede acceder a Google Maps: {message}',
  },
  errorTooSoon: {
    en: 'Read {n} s ago: the reading is kept to save requests.',
    fr: 'Mesuré il y a {n} s : la mesure est gardée pour économiser les requêtes.',
    de: 'Vor {n} s gemessen: Die Messung wird behalten, um Anfragen zu sparen.',
    es: 'Medido hace {n} s: se conserva la medida para ahorrar solicitudes.',
  },
  errorUnknownDevice: {
    en: 'This device is not one of the trips of the integration.',
    fr: 'Cet appareil n’est pas un des trajets de l’intégration.',
    de: 'Dieses Gerät ist keine Strecke der Integration.',
    es: 'Este dispositivo no es uno de los trayectos de la integración.',
  },

  // widgets
  widgetNoKey: {
    en: 'Type your Google Maps Platform API key in the configuration of the integration.',
    fr: 'Saisissez votre clé d’API Google Maps Platform dans la configuration de l’intégration.',
    de: 'Geben Sie Ihren Google-Maps-Platform-API-Schlüssel in der Konfiguration der Integration ein.',
    es: 'Escriba su clave de API de Google Maps Platform en la configuración de la integración.',
  },
  widgetEmpty: {
    en: 'No trip yet: add one with “Add a trip” in the configuration of the integration.',
    fr: 'Aucun trajet pour l’instant : ajoutez-en un avec « Ajouter un trajet » dans la configuration de l’intégration.',
    de: 'Noch keine Strecke: Fügen Sie eine mit „Strecke hinzufügen“ in der Konfiguration der Integration hinzu.',
    es: 'Todavía no hay trayectos: añada uno con «Añadir un trayecto» en la configuración de la integración.',
  },
  widgetChooseTrip: {
    en: 'Choose a trip in the settings of the widget.',
    fr: 'Choisissez un trajet dans les réglages du widget.',
    de: 'Wählen Sie eine Strecke in den Einstellungen des Widgets.',
    es: 'Elija un trayecto en los ajustes del widget.',
  },
  widgetUnknownTrip: {
    en: 'This trip no longer exists: choose another one in the settings of the widget.',
    fr: 'Ce trajet n’existe plus : choisissez-en un autre dans les réglages du widget.',
    de: 'Diese Strecke gibt es nicht mehr: Wählen Sie eine andere in den Einstellungen des Widgets.',
    es: 'Este trayecto ya no existe: elija otro en los ajustes del widget.',
  },
  widgetNoReading: {
    en: 'No reading yet: the trip is read on its days and hours ({days}, {hours}), or with the button.',
    fr: 'Aucune mesure pour l’instant : le trajet est mesuré sur ses jours et heures ({days}, {hours}), ou avec le bouton.',
    de: 'Noch keine Messung: Die Strecke wird an ihren Tagen und Stunden gemessen ({days}, {hours}) oder mit der Schaltfläche.',
    es: 'Todavía no hay medida: el trayecto se mide en sus días y horas ({days}, {hours}), o con el botón.',
  },
  tripsCaption: {
    en: 'Updated {updated}',
    fr: 'Mis à jour {updated}',
    de: 'Aktualisiert {updated}',
    es: 'Actualizado {updated}',
  },
  tileDuration: { en: 'Travel time', fr: 'Durée', de: 'Fahrzeit', es: 'Duración' },
  tileDelay: { en: 'Traffic delay', fr: 'Retard trafic', de: 'Verzögerung', es: 'Retraso' },
  tileNoTraffic: {
    en: 'Without traffic',
    fr: 'Sans trafic',
    de: 'Ohne Verkehr',
    es: 'Sin tráfico',
  },
  tileDistance: { en: 'Distance', fr: 'Distance', de: 'Entfernung', es: 'Distancia' },
  statusRoute: { en: 'Route', fr: 'Itinéraire', de: 'Route', es: 'Ruta' },
  statusMode: { en: 'Travel mode', fr: 'Mode', de: 'Fortbewegung', es: 'Modo' },
  statusUpdated: { en: 'Updated', fr: 'Mis à jour', de: 'Aktualisiert', es: 'Actualizado' },
  statusSchedule: { en: 'Read', fr: 'Mesuré', de: 'Gemessen', es: 'Medido' },
  statusError: {
    en: 'Last error',
    fr: 'Dernière erreur',
    de: 'Letzter Fehler',
    es: 'Último error',
  },
  buttonRefresh: { en: 'Refresh', fr: 'Actualiser', de: 'Aktualisieren', es: 'Actualizar' },
  buttonRefreshAll: {
    en: 'Refresh all',
    fr: 'Tout actualiser',
    de: 'Alle aktualisieren',
    es: 'Actualizar todo',
  },
  toastRefreshed: {
    en: 'Refreshed: {summary}',
    fr: 'Actualisé : {summary}',
    de: 'Aktualisiert: {summary}',
    es: 'Actualizado: {summary}',
  },
  toastRefreshedAll: {
    en: '{count} trip(s) refreshed.',
    fr: '{count} trajet(s) actualisé(s).',
    de: '{count} Strecke(n) aktualisiert.',
    es: '{count} trayecto(s) actualizado(s).',
  },
  budgetCaption: {
    en: 'Budget: {percent} % of the free monthly usage',
    fr: 'Budget : {percent} % de l’usage mensuel gratuit',
    de: 'Budget: {percent} % des monatlichen Gratiskontingents',
    es: 'Presupuesto: {percent} % del uso mensual gratuito',
  },
  budgetPlannedLabel: {
    en: 'Planned a month',
    fr: 'Prévu par mois',
    de: 'Geplant pro Monat',
    es: 'Previsto al mes',
  },
  gaugeLabel: {
    en: '{sku} of {budget}',
    fr: '{sku} sur {budget}',
    de: '{sku} von {budget}',
    es: '{sku} de {budget}',
  },
  budgetPlanned: {
    en: '{count} {sku}',
    fr: '{count} {sku}',
    de: '{count} {sku}',
    es: '{count} {sku}',
  },
  budgetNothingPlanned: { en: 'nothing', fr: 'rien', de: 'nichts', es: 'nada' },
  budgetKey: { en: 'API key', fr: 'Clé d’API', de: 'API-Schlüssel', es: 'Clave de API' },
  budgetKeyOk: { en: 'Accepted', fr: 'Acceptée', de: 'Akzeptiert', es: 'Aceptada' },
  budgetKeyUnknown: {
    en: 'Not used yet',
    fr: 'Pas encore utilisée',
    de: 'Noch nicht genutzt',
    es: 'Aún sin usar',
  },
  budgetKeyRefused: { en: 'Refused', fr: 'Refusée', de: 'Abgelehnt', es: 'Rechazada' },
  budgetKeyMissing: { en: 'Missing', fr: 'Manquante', de: 'Fehlt', es: 'Falta' },
  budgetPaused: {
    en: 'Paused (429)',
    fr: 'En pause (429)',
    de: 'Pausiert (429)',
    es: 'En pausa (429)',
  },
};

/**
 * @description Whether a value is one of the languages of the integration.
 * @param {unknown} value - The value.
 * @returns {boolean} True for en, fr, de, es.
 */
function isLanguage(value) {
  return LANGUAGES.includes(value);
}

/**
 * @description A text in a language (English fallback), with its
 * substitutions.
 * @param {string} key - The TEXTS key.
 * @param {string} language - The language.
 * @param {object} [values] - The substitutions.
 * @returns {string} The text.
 * @example
 * t('minutesAgo', 'fr', { n: 3 }); // -> 'il y a 3 min'
 */
function t(key, language, values = {}) {
  const entry = TEXTS[key];
  if (!entry) {
    return key;
  }
  const template = entry[language] ?? entry.en;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}

/**
 * @description The text in every language, for a multi-language message.
 * @param {string|Function} key - The TEXTS key, or `(language) => string`.
 * @param {object} [values] - The substitutions.
 * @returns {{ en: string, fr: string, de: string, es: string }} The message.
 * @example
 * all('statusEmpty');
 */
function all(key, values = {}) {
  return Object.fromEntries(
    LANGUAGES.map((language) => [
      language,
      typeof key === 'function' ? key(language) : t(key, language, values),
    ]),
  );
}

const locale = (language) => (isLanguage(language) ? language : 'en');

/**
 * @description A number written in a language ("4 500", "4,500", "12,5").
 * @param {number} n - The number.
 * @param {string} language - The language.
 * @returns {string} The text.
 */
const formatNumber = (n, language) =>
  new Intl.NumberFormat(locale(language), { maximumFractionDigits: 1 }).format(n);

/**
 * @description How long ago an instant was: "just now", "12 min ago", "3 h ago".
 * @param {number} at - The instant, in ms (0: never).
 * @param {number} now - Now, in ms.
 * @param {string} language - The language.
 * @returns {string} The text.
 */
function ago(at, now, language) {
  if (!at) return t('never', language);
  const minutes = Math.floor((now - at) / 60000);
  if (minutes < 1) return t('justNow', language);
  if (minutes < 60) return t('minutesAgo', language, { n: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return t('hoursAgo', language, { n: hours });
  return t('daysAgo', language, { n: Math.floor(hours / 24) });
}

/**
 * @description The month of an instant, as a title: "October 2026".
 * @param {string} month - "YYYY-MM".
 * @param {string} language - The language.
 * @returns {string} The text.
 */
function formatMonth(month, language) {
  const [year, number] = month.split('-').map(Number);
  const text = new Intl.DateTimeFormat(locale(language), {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, number - 1, 1)));
  return text.charAt(0).toLocaleUpperCase(locale(language)) + text.slice(1);
}

export { LANGUAGES, TEXTS, isLanguage, t, all, formatNumber, ago, formatMonth };
