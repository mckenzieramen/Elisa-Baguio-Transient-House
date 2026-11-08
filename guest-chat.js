import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,signInAnonymously,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,collection,doc,addDoc,setDoc,onSnapshot,query,orderBy,serverTimestamp,limit} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const app=getApps().length?getApp():initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const toggle=document.getElementById('chatToggle'),panel=document.getElementById('chatPanel'),form=document.getElementById('guestChatForm'),input=document.getElementById('guestChatText'),feed=document.getElementById('guestChatFeed'),status=document.getElementById('guestChatStatus');
let uid=null,unsubscribe=null;
const note=t=>status.textContent=t;
toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)input.focus()};
document.getElementById('chatClose').onclick=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false')};
function paint(messages){feed.replaceChildren();for(const m of messages){const p=document.createElement('p');p.className='chat-bubble '+(m.sender==='guest'?'mine':'theirs');p.textContent=m.text;feed.appendChild(p)}feed.scrollTop=feed.scrollHeight}
onAuthStateChanged(auth,async user=>{
 if(!user){try{await signInAnonymously(auth)}catch(e){note('Live chat unavailable. Please use Messenger.');input.disabled=true}return}
 if(!user.isAnonymous){note('Chat as a guest in a private browser window or use Messenger.');input.disabled=true;return}
 uid=user.uid;unsubscribe?.();
 unsubscribe=onSnapshot(query(collection(db,'supportChats',uid,'messages'),orderBy('createdAt','asc'),limit(100)),s=>{paint(s.docs.map(x=>x.data()));note('Messages are shared with our support team.')},()=>note('Chat not ready. Please enable Firestore and deploy security rules.'));
},()=>note('Could not connect to chat.'));
form.onsubmit=async e=>{e.preventDefault();const value=input.value.trim();if(!uid||!value)return;if(value.length>1000){note('Maximum 1000 characters.');return}const btn=form.querySelector('button');btn.disabled=true;try{await setDoc(doc(db,'supportChats',uid),{guestUid:uid,updatedAt:serverTimestamp(),lastMessage:value.slice(0,140)},{merge:true});await addDoc(collection(db,'supportChats',uid,'messages'),{sender:'guest',text:value,createdAt:serverTimestamp()});input.value=''}catch{note('Message could not be sent. Check connection or chat setup.')}finally{btn.disabled=false}};
