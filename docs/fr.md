# Google Maps Travel Time

## Présentation

Cette intégration suit vos trajets habituels — maison-travail, école, aéroport — avec la durée de Google Maps. Pour chaque trajet, elle donne la durée avec le trafic en temps réel, le retard dû au trafic, la distance et les routes principales, et elle peut lancer vos scènes quand le trafic se dégrade ou que l’itinéraire change.

- Chaque trajet devient un **appareil** : durée, durée sans trafic et retard dû au trafic (voiture et deux-roues), distance, routes principales.
- Les trajets sont mesurés **seulement sur leurs jours et leurs heures**, pour que les requêtes restent dans l’usage mensuel gratuit de Google.
- **Déclencheurs de scène** : l’itinéraire d’un trajet change, le budget du mois est presque utilisé, Google refuse la clé d’API. **Actions de scène** : calculer un itinéraire maintenant, mesurer un trajet maintenant.
- Trois **widgets de tableau de bord** : les temps de trajet, un trajet, les requêtes du mois.

![Les trois widgets de l’intégration : temps de trajet, un trajet et requêtes du mois (illustration générée, pas une capture d’écran)](https://raw.githubusercontent.com/William-De71/gladys-google-maps-travel-time/main/docs/assets/widgets.fr.png)

L’image ci-dessus est une illustration générée, pas une capture d’écran. Sans lien avec Google ; pas encore testée avec une vraie clé d’API.

## Prérequis

- Gladys Assistant 5.3.0 ou plus récent.
- Une **clé d’API Google Maps Platform** :
  1. Dans la [console Google Cloud](https://console.cloud.google.com/), créez un projet (ou choisissez-en un) et associez-lui un **compte de facturation** : Google l’exige même si vous restez dans l’usage gratuit.
  2. Activez la **Routes API** (API et services → Bibliothèque → « Routes API »).
  3. Créez une **clé d’API** (Google Maps Platform → Clés et identifiants) et limitez-la à la Routes API. Une restriction par adresse IP ne marche que si l’adresse IP publique de votre Gladys est fixe.
- Le fuseau horaire de Gladys bien réglé (**Paramètres > Système**) : les heures des trajets y sont lues.

**Coût.** Google facture chaque requête réussie au-delà d’un usage mensuel gratuit par type de requête : 5 000 requêtes en voiture avec trafic (« Pro »), 1 000 en moto ou scooter (« Enterprise »), 10 000 à vélo, à pied ou en transports en commun (« Essentials »). Un trajet en voiture mesuré toutes les 15 minutes de 6 h à 21 h, du lundi au vendredi, utilise environ 1 300 requêtes par mois. L’intégration reste par défaut sous 90 % de chaque usage gratuit et mesure les trajets moins souvent plutôt que de le dépasser. L’usage gratuit appartient au compte de facturation : les autres usages du compte comptent aussi.

## Configuration

Les trajets ne se saisissent pas en JSON : chacun est un petit formulaire, derrière les boutons en bas de la page de configuration.

| Champ ou bouton                | Description                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Clé d’API Google Maps Platform | Obligatoire. Gardée secrète par Gladys, jamais réaffichée ni écrite dans les journaux.                                                                                                                 |
| Intervalle par défaut          | Minutes entre deux mesures d’un trajet sans intervalle propre (5 à 240, 15 par défaut).                                                                                                                |
| Seuil de retard par défaut     | Retard dû au trafic, en minutes, à partir duquel un trajet s’affiche en rouge dans les widgets (orange dès 3 minutes). 10 par défaut.                                                                  |
| Budget mensuel                 | Part de l’usage gratuit de chaque type de requête que l’intégration peut dépenser. 90 par défaut ; au-delà de 100, Google facture les requêtes en plus.                                                |
| Langue des textes              | Noms des fonctionnalités, descriptions d’itinéraire, résumés des scènes, messages des boutons. **Choisissez-la avant d’ajouter vos appareils** : un appareil garde les noms avec lesquels il est créé. |
| Ajouter un trajet              | Nom, départ, arrivée, mode de déplacement, éviter péages / autoroutes / ferries, jours, heures (« 6-10, 16-20 », vide : 6-21), intervalle et seuil propres.                                            |
| Modifier un trajet             | Le trajet par son nom ou son numéro (#2) ; seuls les champs remplis changent. 0 remet l’intervalle ou le seuil par défaut.                                                                             |
| Supprimer un trajet            | Le trajet par son nom ou son numéro. Son appareil reste dans Gladys jusqu’à ce que vous le supprimiez.                                                                                                 |
| Lister les trajets             | Chaque trajet avec son planning, les requêtes prévues, sa dernière mesure et sa dernière erreur, et les requêtes du mois.                                                                              |
| Tester la clé d’API            | Calcule une courte marche dans Paris (une requête Essentials) et dit quoi corriger si Google refuse la clé.                                                                                            |

Départ et arrivée acceptent une adresse, un lieu (« Lyon Part-Dieu »), un plus code, ou des coordonnées « latitude, longitude » (comme `45.7640, 4.8357`).

## Utilisation

### Trajets

1. Collez la clé d’API et appuyez sur **Tester la clé d’API**.
2. Appuyez sur **Ajouter un trajet** pour chaque trajet habituel. Par défaut : en voiture, du lundi au vendredi de 6 h à 21 h, toutes les 15 minutes ; adaptez les jours et les heures à votre besoin.
3. La première mesure arrive dans la minute si le trajet est dans ses heures. Hors de ses heures, le trajet garde sa dernière mesure.

### Appareils

Ouvrez l’onglet **Découverte** et ajoutez les trajets voulus. Chaque appareil a :

- **Durée avec trafic** (minutes ; « Durée du trajet » à vélo, à pied et en transports en commun) ;
- **Durée sans trafic** et **Retard dû au trafic** (minutes ; voiture et deux-roues) ;
- **Distance** (km) et **Itinéraire** (les routes principales, comme « A6 »).

Les valeurs suivent les mesures du trajet ; Gladys garde leur historique.

### Widgets du tableau de bord

- **Temps de trajet** : les trajets avec durée, distance et routes, un badge de retard (vert, orange dès 3 minutes, rouge dès le seuil du trajet), un lien vers l’itinéraire dans Google Maps, et **Tout actualiser**.
- **Trajet** : un trajet, choisi parmi les appareils : quatre tuiles, itinéraire, dernière mesure, **Actualiser**.
- **Requêtes Google Maps** : une jauge par type de requête utilisé, ce que les trajets prévoient par mois, l’état de la clé.

Un bouton d’actualisation dépense une requête par trajet, aucune pour un trajet mesuré il y a moins d’une minute.

### Scènes

Déclencheurs de l’intégration :

- **L’itinéraire d’un trajet change** : lors d’une mesure planifiée, l’itinéraire le plus rapide passe par d’autres routes qu’à la précédente. Variables : nom, itinéraire, itinéraire précédent, durée, retard, distance, phrase de résumé.
- **Le budget du mois est presque utilisé** : un type de requête atteint 80 %, puis 100 % de son budget (une fois chacun par mois).
- **Google refuse la clé d’API** : une fois, jusqu’à ce qu’une requête fonctionne de nouveau ; le résumé dit quoi corriger.

Pour un seuil (« le retard dépasse 10 minutes », « la durée dépasse 40 minutes »), utilisez le **déclencheur d’appareil** de Gladys sur la fonctionnalité du trajet.

Actions : **Calculer un itinéraire** (deux lieux quelconques, maintenant) et **Mesurer un trajet maintenant** (même hors de ses heures). Les deux renvoient la durée, la durée sans trafic, le retard, la distance, l’itinéraire et une phrase de résumé comme « Travail : 38 min, dont 14 min de trafic, 11,8 km par M6. » à envoyer dans un message.

Exemples :

- Quand le retard dû au trafic de « Travail » dépasse 10 minutes → envoyer le résumé du trajet.
- Chaque jour de semaine à 7 h 15 → mesurer « Travail » maintenant → envoyer `{{0.0.summary}}` à la famille.

### Transport

L’intégration passe par les serveurs de Google (cloud) : **les adresses de vos trajets sont envoyées à Google** à chaque mesure, avec votre clé d’API. Les trajets sont gardés dans la configuration de Gladys ; les dernières mesures et le compteur de requêtes dans le volume `/data` de l’intégration.

## Dépannage

- **« Google refuse la clé d’API »** : le message donne la raison de Google. `API_KEY_INVALID` : recopiez la clé. `SERVICE_DISABLED` : activez la Routes API dans le projet de la clé. `BILLING_DISABLED` : associez un compte de facturation. `API_KEY_SERVICE_BLOCKED` : ajoutez la Routes API aux API autorisées de la clé. Une restriction par IP refuse Gladys si son adresse publique a changé. L’intégration réessaie toutes les heures, et tout de suite après **Tester la clé d’API** ou une nouvelle clé.
- **Un trajet n’a aucune mesure** : vérifiez ses jours et ses heures avec **Lister les trajets** (le fuseau horaire affiché doit être le vôtre), et sa dernière erreur : « Google n’a trouvé aucun itinéraire » signale une adresse que Google ne sait pas placer, ou un mode de déplacement indisponible à cet endroit.
- **Mesures plus rares que l’intervalle** : « allongé … pour rester dans le budget » dans **Lister les trajets** signifie que les trajets de ce type de requête prévoient plus que le budget ; réduisez les heures, les trajets ou l’intervalle, ou augmentez le budget.
- **« Les requêtes du mois sont utilisées »** : le budget de ce type de requête est atteint ; les trajets concernés attendent le mois suivant (UTC). Le décompte de Google (console Cloud → Google Maps Platform → Métriques) fait foi.
- **429** : Google limite les requêtes de la clé ; l’intégration attend 15 minutes.
- Pour signaler un problème, donnez les versions de Gladys et de l’intégration, le texte de **Lister les trajets** (masquez vos adresses si vous le souhaitez) et les journaux de l’intégration (Paramètres → Supervision). Ne collez jamais votre clé d’API.
