(function () {
  const BOYUT = "clamp(26px,8vw,44px)";

  function uygula(el) {
    el.style.setProperty("font-size", BOYUT, "important");
    el.style.setProperty("font-weight", "700", "important");
    el.style.setProperty("letter-spacing", "normal", "important");
    el.style.setProperty("line-height", "normal", "important");
    el.style.setProperty("zoom", "1", "important");
  }

  function duzelt() {
    document.querySelectorAll("h1").forEach(uygula);
    document.querySelectorAll("body *").forEach(function (el) {
      if (
        el.children.length === 0 &&
        el.textContent.length < 30 &&
        el.textContent.toLocaleUpperCase("tr").indexOf("BEYİN FIRTINASI") > -1
      ) {
        uygula(el);
      }
    });
  }

  duzelt();
  new MutationObserver(duzelt).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"]
  });
})();
