import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
const firebaseConfig={
 apiKey:'AIzaSyC5rHxbtHdY8-9Gh4Wy01Cgugyt58sF90E',
 authDomain:'elisa-baguio-transient-house.firebaseapp.com',
 projectId:'elisa-baguio-transient-house',
 storageBucket:'elisa-baguio-transient-house.firebasestorage.app',
 messagingSenderId:'103034958888',
 appId:'1:103034958888:web:62e4806b7d6e1c7950711d'
};
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const screen=document.getElementById('authScreen'),shell=document.getElementById('adminShell'),form=document.getElementById('loginForm'),message=document.getElementById('authMessage'),button=document.getElementById('loginButton');
let dashboardLoaded=false;
const showMessage=text=>{message.textContent=text};
onAuthStateChanged(auth,user=>{
 if(user){
  screen.hidden=true;shell.hidden=false;
  document.getElementById('signedInEmail').textContent=user.email||'Administrator';
  if(!dashboardLoaded){dashboardLoaded=true;const script=document.createElement('script');script.src='admin.js';script.onerror=()=>{dashboardLoaded=false;alert('Could not load admin dashboard. Refresh to retry.')};document.body.appendChild(script)}
 }else{screen.hidden=false;shell.hidden=true;document.getElementById('adminPassword').value=''}
},()=>showMessage('Unable to verify your session. Please reload and try again.'));
form.addEventListener('submit',async e=>{
 e.preventDefault();button.disabled=true;button.textContent='Signing in…';showMessage('');
 try{await signInWithEmailAndPassword(auth,document.getElementById('adminEmail').value.trim(),document.getElementById('adminPassword').value)}
 catch(err){const messages={'auth/invalid-credential':'Incorrect email or password.','auth/invalid-email':'Please enter a valid email.','auth/too-many-requests':'Too many attempts. Try again later.','auth/network-request-failed':'Network error. Check your connection.','auth/operation-not-allowed':'Enable Email/Password sign-in in Firebase Console.','auth/unauthorized-domain':'Add this website domain to Firebase authorized domains.'};showMessage(messages[err.code]||'Sign-in failed. Check Firebase setup and try again.')}
 finally{button.disabled=false;button.textContent='Sign In'}
});
document.getElementById('signOutButton').addEventListener('click',async()=>{try{await signOut(auth)}catch{alert('Sign out failed. Please try again.')}});
document.getElementById('togglePassword').addEventListener('click',()=>{
 const input=document.getElementById('adminPassword');input.type=input.type==='password'?'text':'password';
 document.getElementById('togglePassword').setAttribute('aria-label',input.type==='password'?'Show password':'Hide password');
});
