const revealItems = document.querySelectorAll(".reveal");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const heroVisual = document.querySelector(".hero-visual");

  if (heroVisual) {
    heroVisual.addEventListener("pointermove", (event) => {
      const bounds = heroVisual.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      heroVisual.style.setProperty("--pointer-x", `${x}%`);
      heroVisual.style.setProperty("--pointer-y", `${y}%`);

      const moveX = (x - 50) * 0.08;
      const moveY = (y - 50) * 0.08;
      heroVisual.querySelector(".code-window").style.translate = `${moveX}px ${moveY}px`;
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--pointer-x", "50%");
      heroVisual.style.setProperty("--pointer-y", "50%");
      heroVisual.querySelector(".code-window").style.translate = "0 0";
    });
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navbar nav a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55%", threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const languageToggle = document.querySelector("#language-toggle");

if (languageToggle) {
  const languageText = {
    ar: {
      nav: ["الرئيسية", "من نحن", "الخدمات", "الأعمال", "تواصل معنا"],
      started: "ابدأ الآن",
      eyebrows: ["حلول رقمية تصنع الفرق", "من نحن", "خبراتنا", "مختارات من أعمالنا", "آراء العملاء", "لديك فكرة؟"],
      heroTitle: ["نبني شيئًا ", "مذهلاً"],
      heroDescription: "نحوّل أفكارك إلى تجربة رقمية واضحة وسريعة تساعدك على النمو والتواصل مع جمهورك.",
      heroButtons: ["شاهد أعمالنا ", "استكشف الخدمات "],
      features: [
        ["أداء سريع", "مواقع خفيفة وسريعة تمنح زوارك تجربة سلسة وتزيد فرص التحويل."],
        ["تصميم عصري", "واجهات واضحة وأنيقة تعكس هوية علامتك وتجذب انتباه المستخدم."],
        ["حلول موثوقة", "برمجة منظمّة ومتجاوبة تعمل بكفاءة على مختلف الأجهزة والمتصفحات."]
      ],
      aboutTitle: ["نفهم الفكرة، ونصنع ", "التجربة المناسبة"],
      aboutDescription: "نطوّر مواقع وتطبيقات تركّز على هدف واضح، سهولة الاستخدام، وتصميم يجعل العلامة متقدّمة وموثوقة.",
      stats: ["مشروعًا منجزًا", "رضا العملاء", "دعم ومتابعة"],
      portfolioTitle: "مشاريع نصنع لها تأثيرًا",
      portfolioLink: "اعمل مشروعك معنا ",
      expertiseTitle: "نحوّل الأفكار إلى منتجات متكاملة",
      skills: [
        ["تصميم واجهات المستخدم", "تصاميم واضحة وسهلة الاستخدام تعكس هوية المشروع وتدعم أهدافه."],
        ["تطوير الواجهات", "تجارب متجاوبة وسريعة مبنية بتفاصيل دقيقة تعمل على جميع الأجهزة."],
        ["أنظمة ولوحات التحليل", "لوحات إدارية ذكية تساعدك على متابعة الأداء واتخاذ قرارات أسرع."]
      ],
      testimonialsTitle: "نتائج تتحدث عن نفسها",
      testimonials: [
        ["فريق احترافي يفهم المطلوب ويقدّم تجربة أنيقة وسريعة، وسهّل علينا إطلاق المشروع بثقة.", "نورة العتيبي", "مديرة مشروع تجاري", "ن"],
        ["التواصل كان واضحًا والتسليم منظمًا، والنتيجة النهائية تجاوزت توقعاتنا في التصميم والأداء.", "سالم الحربي", "مؤسس شركة ناشئة", "س"]
      ],
      projects: [
        ["تطوير وتصميم", "منصة أعمال متكاملة"],
        ["تصميم تطبيق", "تطبيق خدمات ذكي"],
        ["نظام لوحة تحكم", "لوحة تحليلات الأعمال"]
      ],
      contactTitle: "لنحوّلها إلى مشروع حقيقي.",
      contactDescription: "أرسل تفاصيل مشروعك وسنساعدك في تحديد الخطوة الأولى.",
      formLabels: ["الاسم", "البريد الإلكتروني", "تفاصيل المشروع"],
      submit: "إرسال الرسالة ",
      success: ["تم إرسال رسالتك بنجاح!", "سنرد عليك في أقرب وقت."],
      error: "يرجى إدخال بيانات صحيحة في جميع الحقول.",
      footerLinks: ["البريد", "الأعمال", "التواصل"],
      copyright: "© 2026 جميع الحقوق محفوظة.",
      description: "نصمم ونبني تجارب رقمية سريعة وواضحة ومناسبة لنمو أعمالك."
    },
    en: {
      nav: ["Home", "About", "Services", "Portfolio", "Contact"],
      started: "Get Started",
      eyebrows: ["Digital solutions that make a difference", "About us", "Our expertise", "Selected work", "Client testimonials", "Have an idea?"],
      heroTitle: ["Build Something ", "Amazing"],
      heroDescription: "We turn your ideas into clear, fast digital experiences that help your business grow and connect with its audience.",
      heroButtons: ["View our work ", "Explore services "],
      features: [
        ["Fast Performance", "Fast, lightweight websites that create a smooth experience and improve conversions."],
        ["Modern Design", "Clear, polished interfaces that reflect your brand and engage your audience."],
        ["Reliable Solutions", "Responsive, maintainable development that works across devices and browsers."]
      ],
      aboutTitle: ["We understand the idea and create ", "the right experience"],
      aboutDescription: "We build websites and apps with a clear purpose, simple usability, and a design that helps your brand stand out.",
      stats: ["Projects completed", "Client satisfaction", "Support"],
      portfolioTitle: "Projects that make an impact",
      portfolioLink: "Build your project with us ",
      expertiseTitle: "Turning ideas into complete products",
      skills: [
        ["UI/UX Design", "Clear, user-friendly designs that reflect the project identity and support its goals."],
        ["Frontend Development", "Fast, responsive experiences built with precise details for every device."],
        ["Systems & Analytics", "Smart dashboards that help you monitor performance and make faster decisions."]
      ],
      testimonialsTitle: "Results that speak for themselves",
      testimonials: [
        ["A professional team that understood our needs and delivered an elegant, fast experience that made launch easy.", "Nora Al-Otaibi", "Commercial Project Manager", "N"],
        ["Communication was clear and delivery was well organized. The final result exceeded our expectations for design and performance.", "Salem Al-Harbi", "Startup Founder", "S"]
      ],
      projects: [
        ["Design & development", "Complete business platform"],
        ["App design", "Smart services app"],
        ["Dashboard system", "Business analytics dashboard"]
      ],
      contactTitle: "Let's turn it into a real project.",
      contactDescription: "Tell us about your idea and we'll help you take the first step.",
      formLabels: ["Name", "Email address", "Project details"],
      submit: "Send message ",
      success: ["Your message was sent successfully!", "We'll get back to you soon."],
      error: "Please enter valid information in all fields.",
      footerLinks: ["Email", "Work", "Contact"],
      copyright: "© 2026 All rights reserved.",
      description: "We build fast, clear digital experiences to help your business grow."
    }
  };

  const setText = (element, value) => {
    if (!element) return;
    const directTextNodes = Array.from(element.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    const meaningfulTextNodes = directTextNodes.filter(
      (node) => node.textContent.trim().length > 0
    );

    if (meaningfulTextNodes.length > 0) {
      meaningfulTextNodes[0].nodeValue = value;
      meaningfulTextNodes.slice(1).forEach((node) => {
        node.nodeValue = "";
      });
      return;
    }

    if (directTextNodes.length > 0) {
      directTextNodes[0].nodeValue = value;
      return;
    }

    element.insertBefore(document.createTextNode(value), element.firstChild);
  };

  const setMany = (selector, values) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (values[index] !== undefined) setText(element, values[index]);
    });
  };

  const applyLanguage = (language) => {
    const text = languageText[language];
    const isEnglish = language === "en";
    document.documentElement.lang = language;
    document.documentElement.dir = isEnglish ? "ltr" : "rtl";
    document.title = isEnglish ? "M | Modern Digital Solutions" : "M | حلول رقمية حديثة";
    document.querySelector('meta[name="description"]').content = text.description;
    document.querySelector(".navbar nav").setAttribute("aria-label", isEnglish ? "Main navigation" : "التنقل الرئيسي");
    document.querySelector(".menu-toggle").setAttribute("aria-label", isEnglish ? "Open navigation menu" : "فتح القائمة");
    document.querySelector(".hero-visual").setAttribute("aria-label", isEnglish ? "Laptop illustration" : "رسم توضيحي لحاسوب محمول");
    document.querySelector(".about-stats").setAttribute("aria-label", isEnglish ? "Our statistics" : "إحصاءاتنا");
    document.querySelector(".logo").setAttribute("aria-label", isEnglish ? "Back to top" : "العودة للبداية");
    document.querySelector(".footer-links").setAttribute("aria-label", isEnglish ? "Contact links" : "روابط التواصل");
    document.querySelector(".back-to-top").setAttribute("aria-label", isEnglish ? "Back to top" : "العودة إلى أعلى الصفحة");

    setMany(".navbar nav a", text.nav);
    setText(document.querySelector(".started-button"), text.started + " ");
    setMany(".eyebrow", text.eyebrows);
    const heroTitle = document.querySelector(".hero-copy h1");
    setText(heroTitle, text.heroTitle[0]);
    setText(heroTitle.querySelector("span"), text.heroTitle[1]);
    setText(document.querySelector(".hero-copy p"), text.heroDescription);
    setMany(".hero-actions a", text.heroButtons);

    document.querySelectorAll(".feature-card").forEach((card, index) => {
      setText(card.querySelector("h2"), text.features[index][0]);
      setText(card.querySelector("p"), text.features[index][1]);
    });

    const aboutTitle = document.querySelector(".about-copy h2");
    setText(aboutTitle, text.aboutTitle[0]);
    setText(aboutTitle.querySelector("span"), text.aboutTitle[1]);
    setText(document.querySelector(".about-copy p"), text.aboutDescription);
    setMany(".about-stats span", text.stats);
    setText(document.querySelector(".expertise .section-heading h2"), text.expertiseTitle);
    setText(document.querySelector(".portfolio .section-heading h2"), text.portfolioTitle);
    setText(document.querySelector(".portfolio .section-heading .text-link"), text.portfolioLink);
    setText(document.querySelector(".testimonials .section-heading h2"), text.testimonialsTitle);

    document.querySelectorAll(".skill-card").forEach((card, index) => {
      setText(card.querySelector(".skill-top strong"), text.skills[index][0]);
      setText(card.querySelector("p"), text.skills[index][1]);
    });

    document.querySelectorAll(".testimonial-card").forEach((card, index) => {
      setText(card.querySelector(":scope > p"), text.testimonials[index][0]);
      setText(card.querySelector(".testimonial-author strong"), text.testimonials[index][1]);
      setText(card.querySelector(".testimonial-author small"), text.testimonials[index][2]);
      setText(card.querySelector(".testimonial-author > span"), text.testimonials[index][3]);
    });

    document.querySelectorAll(".project-details").forEach((project, index) => {
      setText(project.querySelector("div > span"), text.projects[index][0]);
      setText(project.querySelector("h3"), text.projects[index][1]);
    });

    setText(document.querySelector(".contact h2"), text.contactTitle);
    setText(document.querySelector(".contact-copy p"), text.contactDescription);
    setMany(".contact-form label", text.formLabels);
    setText(document.querySelector(".contact-form button"), text.submit);
    setText(document.querySelector(".form-success strong"), text.success[0]);
    setText(document.querySelector(".form-success span"), text.success[1]);
    setText(document.querySelector(".form-error"), text.error);
    setMany(".footer-links a", text.footerLinks);
    setText(document.querySelector("footer p"), text.copyright);

    document.querySelectorAll('[aria-hidden="true"]').forEach((icon) => {
      if (/^(←|→)$/.test(icon.textContent.trim())) icon.textContent = isEnglish ? "→" : "←";
      if (/^(◀|▶)$/.test(icon.textContent.trim())) icon.textContent = isEnglish ? "▶" : "◀";
    });
    languageToggle.textContent = isEnglish ? "ع" : "EN";
    languageToggle.setAttribute("aria-label", isEnglish ? "غيّر اللغة إلى العربية" : "Switch language to English");
    try {
      localStorage.setItem("portfolio-language", language);
    } catch (error) {
      console.warn("Could not save the language preference.", error);
    }
  };

  let savedLanguage = "ar";
  try {
    const storedLanguage = localStorage.getItem("portfolio-language");
    if (storedLanguage === "ar" || storedLanguage === "en") savedLanguage = storedLanguage;
  } catch (error) {
    console.warn("Could not read the saved language preference.", error);
  }

  applyLanguage(savedLanguage);
  languageToggle.addEventListener("click", () => {
    const nextLanguage = document.documentElement.lang === "ar" ? "en" : "ar";
    applyLanguage(nextLanguage);
  });
}
