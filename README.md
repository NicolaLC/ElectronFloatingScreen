# ELECTRON FLOATING SCREEN

## Introduzione
Questo tutorial tratta la creazione di floating screen utilizzando Electron, nello specifico di una loading screen in stile Discord/Slack/GitKraken.

[Electron](https://electronjs.org/) è un sistema innovativo che permette di creare applicazioni desktop/mobile sfruttando tutta la potenza, comodità e qualità di una web application.

Perchè [Electron](https://electronjs.org/) è **sempre di più** la scelta giusta da fare se dobbiamo implementare applicazioni per più sistemi?

1. Possiamo gestire più applicazioni, su diversi environment, mediante un **unico entry point**, ovvero la nostra web app.
2. Gli aggiornamenti sono **trasversali**, questo significa che una release per la stessa app viene fatta per tutti i sistemi supportati.
3. Gli aggiornamenti sono **indipendenti**, se ad esempio la nostra app Electron si appoggia ad un url remoto, una volta aggiornata la web app in remoto tutte le applicazioni electron riceveranno l'aggiornamento, in quanto si appoggiano ad un applicazione remota.
4. Possiamo fornire una web application in un contesto sicuro, eliminando la possibilità, ad esempio, di fare un **inspect** del codice.

Questo tutorial si occupa di introdurre il lettore al mondo electron, con un semplice esempio: la creazione di una loading screen customizzata per le nostre app! Un bellissimo esempio dell'elasticità e potenza di electron.

## L'autore

Mi chiamo [Nicola Castellani](https://www.linkedin.com/in/nicola-castellani-313b9084/) e sono uno sviluppatore Freelance fullstack (BE 40% FE 60%) dal 2018. Mi occupo principalmente di web applications REACT e Angular, ma anche di contenuti 3d, come giochi, app multimediali e contenuti webgl.

Ho deciso di scrivere questo tutorial per dimostrare la potenza di Electron e introdurre lo stesso a chi non lo conoscesse.

## Requisiti minimi
Per seguire questo tutorial è necessario avere delle conoscenze minime dei seguenti:

1. HTML
2. Javascript
3. NPM (e Node ovviamente)

## Getting Started
Per iniziare, seguendo la guida ufficiale di Electron, ci viene consigliato di partire dal loro **boilerplate**:

1. Cloniamo il progetto base di Electron:

```bash
git clone https://github.com/electron/electron-quick-start
```

2. Spostiamoci nella directory del progetto clonato

```bash
cd electron-quick-start
```

3. Installiamo le dipendenze richieste:

```bash
npm install
```

4. Lanciamo il progetto:

```bash
npm start
```

**PLUS** Personalmente consiglio di utilizzare **yarn** come package manager, soprattutto su Windows, in quanto npm è decisamente più lento e meno furbo:

```bash
# installa yarn globalmente
npm i -g yarn
# installa le dipendenze
yarn
#lancia il progetto
yarn start
```

Se il tutto è andato a buon fine, si aprirà una finestra Hello World di electron!

![Electron first image](./electron-quick-start/assets/tutorial/test01.PNG)

## CREARE LA LOADING SCREEN

Ora che abbiamo avviato il tutto con successo non ci resta che procedere con la creazione della loading screen.

Navigando nella cartella del progetto, all'interno del file **main.js** troverete un metodo **createWindow**, il quale si occupa di creare la BrowserWindow principale caricando il file index.html del progetto.

Per creare una loading screen la logica è molto semplice, in pratica è necessario creare una seconda BrowserWindow, la quale carica un file html separato, che chiameremo per comodità **loading.html**.

Procediamo con la creazione di questa screen:

1. Creiamo una directory separata per la nostra loading screen:

```bash
mkdir windows/loading
cd windows/loading
```

2. Creiamo il file html per la loading screen:

```bash
echo >> loading.html
```

3. Possiamo copiare e incollare quanto presente nel file index.html oppure creare un documento html a nostro piacimento. Per questa prima fase è sufficiente copiare il contenuto del file index.html:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello Loading World!</title>
  </head>
  <body>
    <h1>Hello Loading World!</h1>
    <!-- All of the Node.js APIs are available in this renderer process. -->
    We are using Node.js <script>document.write(process.versions.node)</script>,
    Chromium <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.

    <script>
      // You can also require other files to run in this process
      require('./renderer.js')
    </script>
  </body>
</html>
```

4. Una volta creato il file loading.html dobbiamo modificare il file main.js in modo che carichi prima la loading screen, e poi quella principale:

```javascript
/// Questo è il metodo originale, dobbiamo modificarlo affinchè crei anche la loading screen
app.on('ready', createWindow);
```
```javascript
/// Questo è il metodo originale, dobbiamo modificarlo affinchè crei anche la loading screen
app.on('ready', () =>
  createLoadingScreen();
  /// per ora lasciamolo commentato
  /// createWindow();
);
```
in questo modo l'applicazione, quando pronta, andrà a richiamare il metodo **createLoadingScreen**, che andiamo a definire in seguito.

5. Definizione del metodo **createLoadingScreen**. Questo metodo ci permette di instanziare una window secondaria, usata per il caricamento:

```javascript
/// Creiamo una variabile globale per mantenere la referenza alla loadingScreen
let loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(Object.assign({
    /// definiamo larghezza e altezza per la window
    width: 200,
    height: 400,
    /// togliamo il frame in alto, ovvero rendiamola floating
    frame: false,
    /// e impostiamo la trasparenza, fondamentale per creare una loading screen floating
    transparent: true
  }));
  loadingScreen.setResizable(false);
  loadingScreen.loadURL('file://' + __dirname + '/windows/loading/loading.html');
  loadingScreen.on('closed', () => loadingScreen = null);
  loadingScreen.webContents.on('did-finish-load', () => {
      loadingScreen.show();
  });
}
```

Se ora ci riposiziamo nella directory main (electron-quick-start) lanciamo il comando **npm start** l'applicazione verrà renderizzata partendo dalla loading screen, che allo stato attuale non ha alcuno stile, quindi vedrete solo le string del file html. Procediamo con la parte più creativa del nostro tutorial, ovvero la creazione della floating loading screen!

## PERSONALIZZAZIONE DELLA LOADING SCREEN

Arrivati a questo punto non ci resta che creare una loading screen di tutto rispetto.

1. Apriamo il file loading.html, e definiamo layout, stili e altro per la pagina:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>FLOATING LOADING SCREEN</title>
    <style>
      /* Definiamo lo stile per il nostro wrapper */
      .LoaderWrapper {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        justify-items: center;
        
        box-sizing: border-box;
        background-color: black;
      }

      .LoaderContent {
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="LoaderWrapper">
      <div class="LoaderContent">
        FLOATING SCREEN!
      </div>
    </div>

    <script>
      // You can also require other files to run in this process
      require('./renderer.js')
    </script>
  </body>
</html>
```
Il risultato è il seguente:

![Electron first image](./electron-quick-start/assets/tutorial/test02.PNG)

Ovviamente questo è un esempio, potete separare stili e logica in file separati, per semplicità manteniamo tutto in un file per il momento.

**PLUS** Consiglio vivamente di usare l'unità di misura **rem** (Responsive em), per gestire eventuali comportamenti responsive in relazione al font-size dell'elemento **root**;

2. Una volta creata la nostra loading screen (ragionate come fosse una pagina html, potete fare quello che volete, aggiungere preloader, immagini, svg, webgl e tanto altro ancora), dobbiamo gestire il **dispose** della stessa in modo che venga mostrata la window principale, torniamo quindi nel file **main.js**, all'interno della funzione **createWindow** e aggiungamo la seguente:

```javascript
[...]
/// restiamo in ascolto dell'evento did-finish-load del contenuto della window
mainWindow.webContents.on('did-finish-load', () => {
  /// quando il contenuto ha caricato, chiudiamo la loading screen e mostriamo la main window
  if (loadingScreen) {
    loadingScreen.close();
  }
  mainWindow.show();
});
```
Però per far si che la window non venga mostrata finchè carica, dobbiamo rivedere il modo in cui viene instanziata:

```javascript
mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: true
  },
  /// aggiungiamo la proprietà **show** a false, in modo che la finestra venga creata ma non mostrata finchè il contenuto non ha terminato il suo caricamento
  show: false
})
[...]
```

3. Una volta definita la logica di creazione e dispose della loadingScreen e della mainWindow, dobbiamo ripristinare la chiamata alla funzione **createWindow**:

```javascript
[...]
app.on('ready', () => {
  createLoadingScreen();
  /// aggiungiamo un timeout per simulare un caricamento piu lungo, questo non è necessario al fine del tutorial
  setTimeout(() => {
    createWindow();
  }, 2000);
})
[...]
```

Lanciando di nuovo il comando **npm start** potete verificare il funzionamento della loading screen, resta visibile per 2 secondi circa e poi viene distrutta, per far spazio alla finestra principale.

## CONCLUSIONI

Questo tutorial si conclude qui, in questo modo potete non solo creare delle loading screen, ma anche dialog box, finestre secondarie che possono essere create e distrutte in modo dipendente dalla finestra principale.

Ad esempio nel mio ultimo progetto ho rivisitato le window di default che vengono mostrate come **alert()** o **confirm()**, intercettando gli eventi javascript dalla finestra principale e creando cosi delle window alternative molto piu belle e allineate al sistema operativo che ospita l'applicazione.
