"use strict";var initializeYoutubeApi=function(){return new Promise(function(e,n){var t=document.createElement("script");t.id="iframe-demo",t.src="https://www.youtube.com/iframe_api";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(t,o),t.onerror=n,window.onYouTubeIframeAPIReady=e})},onYoutubeReady=function(){var n=document.querySelector(".player__control--play"),t=document.querySelector(".player__screen-placeholder"),e=!1,o=!1,a=new YT.Player("video",{events:{onReady:function(){e=!0},onError:function(){o=!0},onStateChange:function(e){e.data==YT.PlayerState.ENDED&&(t.style.display="block",n.style.display="block")}}});n.addEventListener("click",function(){o?openInNewTab(a.getVideoUrl()):e&&(t.style.display="none",n.style.display="none",a.playVideo())})},openInNewTab=function(e){window.open(e,"_blank").focus()};document.addEventListener("DOMContentLoaded",function(){initializeYoutubeApi().then(onYoutubeReady)});
//# sourceMappingURL=script.js.map
