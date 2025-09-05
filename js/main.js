/* ============================================ */
/*      Force Start At Top On First Load        */
/* ============================================ */

// 禁用浏览器的滚动恢复（避免刷新/返回时停在原地）
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 页面加载完成后回到顶部（含 bfcache 场景）
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// 从缓存返回时（pageshow + persisted=true）也回到顶部
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    window.scrollTo(0, 0);
  }
});

// 如果地址栏自带 hash，先移除 hash，再置顶（避免一进来就跳到锚点）
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }
});

// add classes for mobile navigation toggling
    var CSbody = document.querySelector("body");
    const CSnavbarMenu = document.querySelector("#cs-navigation");
    const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

    CShamburgerMenu.addEventListener('click', function() {
        CShamburgerMenu.classList.toggle("cs-active");
        CSnavbarMenu.classList.toggle("cs-active");
        CSbody.classList.toggle("cs-open");
        // run the function to check the aria-expanded value
        ariaExpanded();
    });

    // checks the value of aria expanded on the cs-ul and changes it accordingly whether it is expanded or not 
    function ariaExpanded() {
        const csUL = document.querySelector('#cs-expanded');
        const csExpanded = csUL.getAttribute('aria-expanded');

        if (csExpanded === 'false') {
            csUL.setAttribute('aria-expanded', 'true');
        } else {
            csUL.setAttribute('aria-expanded', 'false');
        }
    }

        // This script adds a class to the body after scrolling 100px
    // and we used these body.scroll styles to create some on scroll 
    // animations with the navbar
    
    document.addEventListener('scroll', (e) => { 
        const scroll = document.documentElement.scrollTop;
        if(scroll >= 100){
    document.querySelector('body').classList.add('scroll')
        } else {
        document.querySelector('body').classList.remove('scroll')
        }
    });


    // mobile nav toggle code
    const dropDowns = Array.from(document.querySelectorAll('#cs-navigation .cs-dropdown'));
        for (const item of dropDowns) {
            const onClick = () => {
            item.classList.toggle('cs-active')
        }
        item.addEventListener('click', onClick)
        }
                                
        /* ============================================ */
/*           Back to Top Button Logic           */
/* ============================================ */

// 获取按钮元素
const backToTopButton = document.getElementById("back-to-top-btn");

// 监听窗口滚动事件
window.addEventListener("scroll", () => {
    // 当垂直滚动距离大于 300px 时
    if (window.pageYOffset > 300) {
        // 给按钮添加 'show' class，使其淡入显示
        backToTopButton.classList.add("show");
    } else {
        // 移除 'show' class，使其淡出隐藏
        backToTopButton.classList.remove("show");
    }
});

// 监听按钮点击事件
backToTopButton.addEventListener("click", (e) => {
    e.preventDefault(); // 阻止 a 标签的默认跳转行为
    // 平滑滚动到页面顶部
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* ============================================ */
/*           Product Filter Logic             */
/* ============================================ */

// 等待整个文档加载完毕
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('#product-showcase .cs-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的 active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 给被点击的按钮添加 active class
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // 如果筛选值是 'all' 或者卡片的类别匹配筛选值
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex'; // 显示卡片
                } else {
                    card.style.display = 'none'; // 隐藏卡片
                }
            });
        });
    });
});

/* ============================
   Buy Now → Quick View（单一实现）
   ============================ */
document.addEventListener('DOMContentLoaded', () => {
  // 统一把 “Shop Now” 改成 “Buy Now”，并取消默认跳转
  document.querySelectorAll('#product-showcase .cs-item .cs-button-solid').forEach(btn => {
    btn.textContent = 'Buy Now';
    btn.setAttribute('aria-label', 'Buy this product');
    btn.setAttribute('href', 'javascript:void(0)');
  });

  const grid  = document.querySelector('#product-showcase .cs-card-group');
  const modal = document.getElementById('product-modal');
  if (!grid || !modal) return;

  const dlg     = modal.querySelector('.pm-dialog');
  const imgEl   = modal.querySelector('#pm-img');
  const titleEl = modal.querySelector('#pm-title');
  const descEl  = modal.querySelector('#pm-desc');
  const focusSel= 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

  let lastTrigger = null;
  let trapHandler = null;

  function openModal(data, trigger){
    // 填充内容
    if (data?.img) {
      const src = data.img.src || data.img;
      imgEl.src = src || '';
      imgEl.alt = data.alt || data.title || data.img.alt || 'Product image';
    }
    titleEl.textContent = data?.title || '';
    descEl.textContent  = data?.desc  || '';

    // 打开：移除 hidden，设 aria，锁滚动
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden','false');
    modal.classList.add('pm-open');
    document.body.classList.add('pm-lock');

    lastTrigger = trigger || null;

    // 简单焦点陷阱
    const focusables = modal.querySelectorAll(focusSel);
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    (dlg || modal).focus({ preventScroll:true });

    trapHandler = (e) => {
      if (e.key !== 'Tab') return;
      if (!focusables.length) { e.preventDefault(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    modal.addEventListener('keydown', trapHandler);
  }

  function closeModal(){
    modal.classList.remove('pm-open');
    // 强制一次回流可提升稳定性（Safari）
    void modal.offsetHeight;
    modal.setAttribute('aria-hidden','true');
    modal.setAttribute('hidden','');
    document.body.classList.remove('pm-lock');

    if (trapHandler) {
      modal.removeEventListener('keydown', trapHandler);
      trapHandler = null;
    }
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus({ preventScroll:true });
    }
  }

  // 委托：点击卡片内的 Buy Now 打开
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.cs-button-solid');
    if (!btn) return;
    e.preventDefault();

    const card  = btn.closest('.cs-item');
    const img   = card?.querySelector('.cs-item-picture');
    const title = card?.querySelector('.cs-item-title')?.textContent?.trim() || '';
    const desc  = card?.querySelector('.cs-item-text')?.textContent?.trim()  || '';

    openModal({ img, title, desc, alt: img?.alt }, btn);
  });

  // 关闭：遮罩或带 data-pm-close 的元素
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-pm-close]') || e.target.classList.contains('pm-backdrop')) {
      e.preventDefault();
      closeModal();
    }
  });

  // 关闭：Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
});
