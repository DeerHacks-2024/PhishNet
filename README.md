[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=0EF71F&random=false&width=435&lines=Protect+Yourself.;No+More+Phishing!!!!!;Several+APIs;Instant+Scan!)](https://git.io/typing-svg)
## catPhish
catPhish is a chrome extension made in React and Python, using several `APIs` services allowing the user to detect whether a page is possible phishing or not.

# Usage
- Git Clone the repository or simply download and extract the zip.
- `cd Frontend`
- `npm install` & `npm install @types/chrome` & `npm install ts-loader` & `npm install style-loader` & `npm install css-loader`
- Python requirements:
```
pip install Flask
pip install openAI
pip install CORS
pip install requests
```

# Initialization
Using the FireBase Auth & FireStore. Simply replace `authentication/firebase.js` with the required FireBase configs : 
```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 


const firebaseConfig = {
  apiKey: "API KEY",
  authDomain: "AUTH DOMAIN",
  projectId: "PROJECT ID",
  storageBucket: "STORAGE BUCKET",
  messagingSenderId: "MESSAGE SENDER ID",
  appId: "APP ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const firestore = getFirestore(app);

export const storage = getStorage(app); 
```

# Deployement 
- Deploy On Web: `npm run dev`
- Deploy on google extensions:
    - `npm run build` -> output -> Dist folder
    - Visit `chrome://extensions/`
    - Enable developer Mode
    - Select `Upload Package`
    - Select the `dist` directory & upload.
    - Finally: Visit `src/Components/scripting` and `python check-url.py`
