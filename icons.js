/* Keep dynamically rendered room cards and dashboard stats iconified. */
(function(){
  let scheduled=false;
  function refresh(){scheduled=false;if(window.lucide&&typeof window.lucide.createIcons==='function'){window.lucide.createIcons({attrs:{'stroke-width':2}})}}
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(refresh)}
  document.addEventListener('DOMContentLoaded',function(){schedule();const targets=[document.getElementById('roomGrid'),document.getElementById('adminContent')].filter(Boolean);targets.forEach(el=>new MutationObserver(schedule).observe(el,{childList:true,subtree:true}));});
})();
