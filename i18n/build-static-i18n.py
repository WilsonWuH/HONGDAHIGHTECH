from __future__ import annotations

import json
import re
import shutil
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://www.hdpth.com"

LOCALES = {
    "en": {"name": "English", "native": "English", "dir": "ltr"},
    "es": {"name": "Spanish", "native": "Español", "dir": "ltr"},
    "ru": {"name": "Russian", "native": "Русский", "dir": "ltr"},
    "ar": {"name": "Arabic", "native": "العربية", "dir": "rtl"},
    "fr": {"name": "French", "native": "Français", "dir": "ltr"},
    "pt": {"name": "Portuguese", "native": "Português", "dir": "ltr"},
}

SKIP_DIRS = {
    "assets", "extracted-product-images", "manual-docx-media", "manual-extracted-media",
    "manual-html-export", "i18n", ".git", "__pycache__",
    *LOCALES.keys(),
}

BASE_ROUTES = [
    "/",
    "/products/",
    "/products/high-speed-slitting-machines/",
    "/products/nonwoven-rewinding-machines/",
    "/products/automatic-knife-systems/",
    "/applications/",
    "/about/",
    "/factory/",
    "/cases/",
    "/resources/",
    "/faq/",
    "/contact/",
    "/inquiry/",
    "/download/",
    "/guides/nonwoven-slitting-machine-buying-guide/",
    "/blog/choosing-nonwoven-slitting-rewinding-machine/",
    "/blog/slitting-rewinding-perforating-comparison/",
    "/blog/automatic-tension-control-nonwoven-slitter-rewinder/",
]

PAGE_META = {
    "en": {
        "/": ("HDPTH | High-Speed Nonwoven Converting Machinery", "HDPTH manufactures nonwoven slitting, rewinding, perforating and automatic knife systems for overseas B2B manufacturers."),
        "/products/": ("Products | HDPTH Nonwoven Converting Machinery", "Explore HDPTH slitting machines, rewinding machines, perforating lines and automatic knife systems for nonwoven converting."),
        "/products/high-speed-slitting-machines/": ("High-Speed Nonwoven Slitting Machines | HDPTH", "High-speed nonwoven slitting machines with clean cutting, stable tension, automatic knife options and manual-based parameters."),
        "/products/nonwoven-rewinding-machines/": ("Nonwoven Rewinding Machines | HDPTH", "Nonwoven rewinding machines for stable roll formation, custom width, controlled tension and export-oriented projects."),
        "/products/automatic-knife-systems/": ("Automatic Knife Systems for Nonwoven Converting | HDPTH", "Automatic knife systems for faster setup, repeatable slitting configuration and HDPTH high-speed converting lines."),
        "/applications/": ("Applications | HDPTH Nonwoven Machinery", "Applications for HDPTH nonwoven converting machinery in hygiene, medical, wipes and industrial roll material production."),
        "/about/": ("About HDPTH | Nonwoven Machinery Manufacturer", "Learn about HDPTH, a China-based manufacturer of nonwoven slitting, rewinding, perforating and auxiliary converting machinery."),
        "/factory/": ("Factory Strength | HDPTH", "HDPTH operates a 6,000 m2 manufacturing base for nonwoven slitting, rewinding and converting machinery."),
        "/cases/": ("Cases & Projects | HDPTH Nonwoven Machinery", "HDPTH project examples for overseas buyers evaluating nonwoven slitting, rewinding, perforating and converting machinery."),
        "/resources/": ("Resources | HDPTH Nonwoven Machinery Guides", "Buyer guides and SEO resources for selecting nonwoven slitting, rewinding and converting equipment."),
        "/faq/": ("FAQ | Nonwoven Slitting & Rewinding Machines | HDPTH", "Buyer FAQ for HDPTH nonwoven slitting machines, rewinding machines, perforating lines and automatic knife systems."),
        "/contact/": ("Contact HDPTH | Request a Quote", "Contact Wilson Wu at HDPTH to request a quote for nonwoven slitting, rewinding and converting machinery."),
        "/inquiry/": ("Inquiry Form | HDPTH Nonwoven Machinery", "Send an RFQ to HDPTH for nonwoven slitting, rewinding, perforating and converting machinery."),
        "/download/": ("Download Catalog | HDPTH", "Request the HDPTH catalog for nonwoven slitting, rewinding, perforating and automatic knife systems."),
        "/guides/nonwoven-slitting-machine-buying-guide/": ("Nonwoven Slitting Machine Buying Guide | HDPTH", "A practical buying guide for nonwoven slitting machines covering material, roll width, speed, knife system and RFQ information."),
        "/blog/choosing-nonwoven-slitting-rewinding-machine/": ("How to Choose a Nonwoven Slitting Rewinding Machine | HDPTH", "A practical buyer guide to choosing a nonwoven slitting rewinding machine for hygiene, medical and wipes production."),
        "/blog/slitting-rewinding-perforating-comparison/": ("Slitting vs Rewinding vs Perforating Machines | HDPTH", "Understand the difference between slitting, rewinding and perforating machines for nonwoven and wipes production."),
        "/blog/automatic-tension-control-nonwoven-slitter-rewinder/": ("Automatic Tension Control in Nonwoven Slitter Rewinders | HDPTH", "Learn why automatic tension control matters in nonwoven slitter rewinders for clean cutting and stable rolls."),
    },
}

PAGE_H1 = {
    "en": {
        "/": "High-Speed Nonwoven Converting Machinery",
        "/products/": "Nonwoven Converting Machinery",
        "/products/high-speed-slitting-machines/": "High-Speed Nonwoven Slitting Machines",
        "/products/nonwoven-rewinding-machines/": "Nonwoven Rewinding Machines",
        "/products/automatic-knife-systems/": "Automatic Knife Systems",
        "/applications/": "Nonwoven Machinery Applications",
        "/about/": "About HDPTH",
        "/factory/": "Factory Strength",
        "/cases/": "Cases & Projects",
        "/resources/": "Buyer Resources",
        "/faq/": "Buyer FAQ",
        "/contact/": "Request a Machine Configuration",
        "/inquiry/": "Tell us your production requirement.",
        "/download/": "Download HDPTH Catalog",
        "/guides/nonwoven-slitting-machine-buying-guide/": "How to Choose a Nonwoven Slitting Machine",
        "/blog/choosing-nonwoven-slitting-rewinding-machine/": "How to Choose a Nonwoven Slitting Rewinding Machine for Hygiene, Medical and Wipes Production",
        "/blog/slitting-rewinding-perforating-comparison/": "Slitting vs Rewinding vs Perforating: Which Nonwoven Converting Line Do You Need?",
        "/blog/automatic-tension-control-nonwoven-slitter-rewinder/": "Automatic Tension Control in Nonwoven Slitter Rewinders: Why It Matters for Clean Cutting and Stable Rolls",
    }
}

LOCALIZED_META = {
    "es": {
        "/": ("HDPTH | Maquinaria de conversión de no tejidos", "HDPTH fabrica cortadoras, rebobinadoras, líneas de perforación y sistemas de cuchillas automáticas para fabricantes B2B internacionales."),
        "/products/": ("Productos | Maquinaria para no tejidos HDPTH", "Explore máquinas de corte, rebobinado, perforación y sistemas de cuchillas automáticas HDPTH."),
        "/products/high-speed-slitting-machines/": ("Máquinas cortadoras de no tejido de alta velocidad | HDPTH", "Corte limpio, tensión estable, opciones de cuchilla automática y parámetros del manual de producto HDPTH."),
        "/products/nonwoven-rewinding-machines/": ("Máquinas rebobinadoras de no tejidos | HDPTH", "Rebobinadoras para formación estable de rollos, ancho personalizado y proyectos de exportación."),
        "/products/automatic-knife-systems/": ("Sistemas de cuchillas automáticas | HDPTH", "Sistemas de cuchillas automáticas para cambios rápidos y corte repetible en líneas de conversión."),
        "/applications/": ("Aplicaciones | Maquinaria HDPTH", "Aplicaciones en higiene, medicina, toallitas y materiales industriales en rollo."),
        "/about/": ("Sobre HDPTH | Fabricante de maquinaria para no tejidos", "Conozca HDPTH, fabricante chino de maquinaria de corte, rebobinado y perforación para no tejidos."),
        "/factory/": ("Capacidad de fábrica | HDPTH", "HDPTH opera una base de fabricación de 6.000 m2 para maquinaria de conversión de no tejidos."),
        "/cases/": ("Casos y proyectos | HDPTH", "Ejemplos de proyectos HDPTH para compradores internacionales de maquinaria de no tejidos."),
        "/resources/": ("Recursos | Guías HDPTH", "Guías para compradores que seleccionan equipos de corte, rebobinado y conversión de no tejidos."),
        "/faq/": ("FAQ | Máquinas de corte y rebobinado HDPTH", "Preguntas frecuentes para compradores de maquinaria HDPTH."),
        "/contact/": ("Contactar HDPTH | Solicitar cotización", "Contacte con Wilson Wu en HDPTH para solicitar una cotización."),
        "/inquiry/": ("Formulario de consulta | HDPTH", "Envíe una solicitud RFQ para maquinaria de corte, rebobinado y perforación."),
    },
    "ru": {
        "/": ("HDPTH | Оборудование для переработки нетканых материалов", "HDPTH производит машины для резки, перемотки, перфорации и автоматические ножевые системы для B2B клиентов."),
        "/products/": ("Продукция | Оборудование HDPTH", "Оборудование HDPTH для резки, перемотки, перфорации и автоматической настройки ножей."),
        "/products/high-speed-slitting-machines/": ("Высокоскоростные машины резки нетканых материалов | HDPTH", "Чистая резка, стабильное натяжение и параметры из руководства HDPTH."),
        "/products/nonwoven-rewinding-machines/": ("Машины перемотки нетканых материалов | HDPTH", "Перемоточные машины для стабильного формирования рулона и экспортных проектов."),
        "/products/automatic-knife-systems/": ("Автоматические ножевые системы | HDPTH", "Автоматические ножевые системы для быстрой настройки и повторяемой резки."),
        "/applications/": ("Области применения | HDPTH", "Применение оборудования HDPTH в гигиене, медицине, салфетках и промышленных материалах."),
        "/about/": ("О компании HDPTH", "HDPTH - китайский производитель оборудования для резки, перемотки и перфорации нетканых материалов."),
        "/factory/": ("Производственная база | HDPTH", "HDPTH имеет производственную базу 6 000 м2 для оборудования переработки нетканых материалов."),
        "/cases/": ("Проекты и кейсы | HDPTH", "Примеры проектов HDPTH для зарубежных покупателей оборудования."),
        "/resources/": ("Ресурсы | Руководства HDPTH", "Руководства для выбора оборудования резки, перемотки и конвертинга."),
        "/faq/": ("FAQ | Оборудование HDPTH", "Частые вопросы покупателей оборудования HDPTH."),
        "/contact/": ("Связаться с HDPTH | Запросить предложение", "Свяжитесь с Wilson Wu в HDPTH для запроса предложения."),
        "/inquiry/": ("Форма запроса | HDPTH", "Отправьте RFQ по оборудованию для резки, перемотки и перфорации."),
    },
    "ar": {
        "/": ("HDPTH | معدات تحويل الأقمشة غير المنسوجة", "تصنع HDPTH آلات الشق وإعادة اللف والتثقيب وأنظمة السكاكين الأوتوماتيكية لعملاء B2B حول العالم."),
        "/products/": ("المنتجات | معدات HDPTH لغير المنسوجات", "استكشف آلات الشق وإعادة اللف والتثقيب وأنظمة السكاكين الأوتوماتيكية من HDPTH."),
        "/products/high-speed-slitting-machines/": ("آلات شق الأقمشة غير المنسوجة عالية السرعة | HDPTH", "شق نظيف، شد ثابت، خيارات سكاكين أوتوماتيكية ومعايير من دليل المنتج."),
        "/products/nonwoven-rewinding-machines/": ("آلات إعادة لف الأقمشة غير المنسوجة | HDPTH", "معدات إعادة لف لتكوين لفات ثابتة ومشاريع تصدير مخصصة."),
        "/products/automatic-knife-systems/": ("أنظمة السكاكين الأوتوماتيكية | HDPTH", "أنظمة سكاكين أوتوماتيكية للإعداد السريع والقطع المتكرر."),
        "/applications/": ("التطبيقات | معدات HDPTH", "تطبيقات في النظافة والطب والمناديل والمواد الصناعية الملفوفة."),
        "/about/": ("حول HDPTH", "HDPTH مصنع صيني لمعدات شق وإعادة لف وتثقيب الأقمشة غير المنسوجة."),
        "/factory/": ("قدرة المصنع | HDPTH", "تدير HDPTH قاعدة تصنيع بمساحة 6,000 م2 لمعدات تحويل غير المنسوجات."),
        "/cases/": ("المشاريع والحالات | HDPTH", "أمثلة مشاريع HDPTH للمشترين الدوليين."),
        "/resources/": ("الموارد | أدلة HDPTH", "أدلة للمشترين لاختيار معدات الشق وإعادة اللف والتحويل."),
        "/faq/": ("الأسئلة الشائعة | HDPTH", "أسئلة شائعة للمشترين حول معدات HDPTH."),
        "/contact/": ("اتصل بـ HDPTH | طلب عرض سعر", "تواصل مع Wilson Wu في HDPTH لطلب عرض سعر."),
        "/inquiry/": ("نموذج الاستفسار | HDPTH", "أرسل طلب RFQ لمعدات الشق وإعادة اللف والتثقيب."),
    },
    "fr": {
        "/": ("HDPTH | Machines de conversion pour non-tissés", "HDPTH fabrique des machines de refente, rembobinage, perforation et systèmes de couteaux automatiques pour clients B2B."),
        "/products/": ("Produits | Machines HDPTH pour non-tissés", "Découvrez les machines HDPTH de refente, rembobinage, perforation et couteaux automatiques."),
        "/products/high-speed-slitting-machines/": ("Machines de refente non-tissé haute vitesse | HDPTH", "Coupe nette, tension stable, options de couteaux automatiques et paramètres issus du manuel HDPTH."),
        "/products/nonwoven-rewinding-machines/": ("Machines de rembobinage non-tissé | HDPTH", "Rembobineuses pour formation stable des rouleaux et projets export."),
        "/products/automatic-knife-systems/": ("Systèmes de couteaux automatiques | HDPTH", "Systèmes de couteaux pour réglage rapide et refente répétable."),
        "/applications/": ("Applications | Machines HDPTH", "Applications dans l'hygiène, le médical, les lingettes et les matériaux industriels."),
        "/about/": ("À propos de HDPTH", "HDPTH est un fabricant chinois de machines de refente, rembobinage et perforation pour non-tissés."),
        "/factory/": ("Capacité usine | HDPTH", "HDPTH exploite une base de fabrication de 6 000 m2 pour machines de conversion non-tissé."),
        "/cases/": ("Cas et projets | HDPTH", "Exemples de projets HDPTH pour acheteurs internationaux."),
        "/resources/": ("Ressources | Guides HDPTH", "Guides d'achat pour choisir des équipements de refente, rembobinage et conversion."),
        "/faq/": ("FAQ | Machines HDPTH", "Questions fréquentes des acheteurs de machines HDPTH."),
        "/contact/": ("Contacter HDPTH | Demander un devis", "Contactez Wilson Wu chez HDPTH pour demander un devis."),
        "/inquiry/": ("Formulaire de demande | HDPTH", "Envoyez une demande RFQ pour machines de refente, rembobinage et perforation."),
    },
    "pt": {
        "/": ("HDPTH | Máquinas de conversão para não tecidos", "A HDPTH fabrica cortadeiras, rebobinadeiras, linhas de perfuração e sistemas de facas automáticas para clientes B2B."),
        "/products/": ("Produtos | Máquinas HDPTH para não tecidos", "Explore máquinas HDPTH de corte, rebobinamento, perfuração e sistemas de facas automáticas."),
        "/products/high-speed-slitting-machines/": ("Máquinas de corte de não tecido de alta velocidade | HDPTH", "Corte limpo, tensão estável, facas automáticas opcionais e parâmetros do manual HDPTH."),
        "/products/nonwoven-rewinding-machines/": ("Máquinas rebobinadeiras para não tecidos | HDPTH", "Rebobinadeiras para formação estável de rolos e projetos de exportação."),
        "/products/automatic-knife-systems/": ("Sistemas de facas automáticas | HDPTH", "Sistemas de facas para setup rápido e corte repetível."),
        "/applications/": ("Aplicações | Máquinas HDPTH", "Aplicações em higiene, medicina, lenços e materiais industriais em rolo."),
        "/about/": ("Sobre a HDPTH", "A HDPTH é fabricante chinesa de máquinas de corte, rebobinamento e perfuração para não tecidos."),
        "/factory/": ("Capacidade de fábrica | HDPTH", "A HDPTH opera uma base fabril de 6.000 m2 para máquinas de conversão de não tecidos."),
        "/cases/": ("Casos e projetos | HDPTH", "Exemplos de projetos HDPTH para compradores internacionais."),
        "/resources/": ("Recursos | Guias HDPTH", "Guias para compradores que selecionam equipamentos de corte, rebobinamento e conversão."),
        "/faq/": ("FAQ | Máquinas HDPTH", "Perguntas frequentes de compradores sobre máquinas HDPTH."),
        "/contact/": ("Contato HDPTH | Solicitar cotação", "Fale com Wilson Wu da HDPTH para solicitar uma cotação."),
        "/inquiry/": ("Formulário de consulta | HDPTH", "Envie um RFQ para máquinas de corte, rebobinamento e perfuração."),
    },
}

for locale, meta in LOCALIZED_META.items():
    PAGE_META[locale] = {**PAGE_META["en"], **meta}

PAGE_H1.update({
    "es": {
        "/": "Maquinaria de conversión de no tejidos de alta velocidad",
        "/products/": "Maquinaria de conversión de no tejidos",
        "/products/high-speed-slitting-machines/": "Máquinas cortadoras de no tejido de alta velocidad",
        "/products/nonwoven-rewinding-machines/": "Máquinas rebobinadoras de no tejidos",
        "/products/automatic-knife-systems/": "Sistemas de cuchillas automáticas",
        "/applications/": "Aplicaciones de maquinaria para no tejidos",
        "/about/": "Sobre HDPTH",
        "/factory/": "Capacidad de fábrica",
        "/cases/": "Casos y proyectos",
        "/resources/": "Recursos para compradores",
        "/faq/": "Preguntas frecuentes",
        "/contact/": "Solicitar configuración de máquina",
        "/inquiry/": "Cuéntenos su requisito de producción.",
        "/download/": "Descargar catálogo HDPTH",
        "/guides/nonwoven-slitting-machine-buying-guide/": "Cómo elegir una máquina cortadora de no tejido",
    },
    "ru": {
        "/": "Высокоскоростное оборудование для переработки нетканых материалов",
        "/products/": "Оборудование для переработки нетканых материалов",
        "/products/high-speed-slitting-machines/": "Высокоскоростные машины резки нетканых материалов",
        "/products/nonwoven-rewinding-machines/": "Машины перемотки нетканых материалов",
        "/products/automatic-knife-systems/": "Автоматические ножевые системы",
        "/applications/": "Области применения оборудования",
        "/about/": "О компании HDPTH",
        "/factory/": "Производственная база",
        "/cases/": "Проекты и кейсы",
        "/resources/": "Ресурсы для покупателей",
        "/faq/": "Частые вопросы",
        "/contact/": "Запрос конфигурации машины",
        "/inquiry/": "Расскажите о ваших производственных требованиях.",
        "/download/": "Скачать каталог HDPTH",
        "/guides/nonwoven-slitting-machine-buying-guide/": "Как выбрать машину резки нетканых материалов",
    },
    "ar": {
        "/": "معدات تحويل الأقمشة غير المنسوجة عالية السرعة",
        "/products/": "معدات تحويل الأقمشة غير المنسوجة",
        "/products/high-speed-slitting-machines/": "آلات شق الأقمشة غير المنسوجة عالية السرعة",
        "/products/nonwoven-rewinding-machines/": "آلات إعادة لف الأقمشة غير المنسوجة",
        "/products/automatic-knife-systems/": "أنظمة السكاكين الأوتوماتيكية",
        "/applications/": "تطبيقات معدات غير المنسوجات",
        "/about/": "حول HDPTH",
        "/factory/": "قدرة المصنع",
        "/cases/": "المشاريع والحالات",
        "/resources/": "موارد المشترين",
        "/faq/": "أسئلة المشترين الشائعة",
        "/contact/": "طلب تكوين آلة",
        "/inquiry/": "أخبرنا بمتطلبات الإنتاج لديك.",
        "/download/": "تحميل كتالوج HDPTH",
        "/guides/nonwoven-slitting-machine-buying-guide/": "كيفية اختيار آلة شق للأقمشة غير المنسوجة",
    },
    "fr": {
        "/": "Machines de conversion non-tissé haute vitesse",
        "/products/": "Machines de conversion pour non-tissés",
        "/products/high-speed-slitting-machines/": "Machines de refente non-tissé haute vitesse",
        "/products/nonwoven-rewinding-machines/": "Machines de rembobinage non-tissé",
        "/products/automatic-knife-systems/": "Systèmes de couteaux automatiques",
        "/applications/": "Applications des machines non-tissé",
        "/about/": "À propos de HDPTH",
        "/factory/": "Capacité usine",
        "/cases/": "Cas et projets",
        "/resources/": "Ressources acheteurs",
        "/faq/": "FAQ acheteurs",
        "/contact/": "Demander une configuration machine",
        "/inquiry/": "Indiquez votre besoin de production.",
        "/download/": "Télécharger le catalogue HDPTH",
        "/guides/nonwoven-slitting-machine-buying-guide/": "Comment choisir une machine de refente non-tissé",
    },
    "pt": {
        "/": "Máquinas de conversão para não tecidos de alta velocidade",
        "/products/": "Máquinas de conversão para não tecidos",
        "/products/high-speed-slitting-machines/": "Máquinas de corte de não tecido de alta velocidade",
        "/products/nonwoven-rewinding-machines/": "Máquinas rebobinadeiras para não tecidos",
        "/products/automatic-knife-systems/": "Sistemas de facas automáticas",
        "/applications/": "Aplicações de máquinas para não tecidos",
        "/about/": "Sobre a HDPTH",
        "/factory/": "Capacidade de fábrica",
        "/cases/": "Casos e projetos",
        "/resources/": "Recursos para compradores",
        "/faq/": "Perguntas frequentes",
        "/contact/": "Solicitar configuração de máquina",
        "/inquiry/": "Informe seu requisito de produção.",
        "/download/": "Baixar catálogo HDPTH",
        "/guides/nonwoven-slitting-machine-buying-guide/": "Como escolher uma máquina de corte de não tecido",
    },
})

PHRASES = {
    "es": {
        "Products": "Productos", "Applications": "Aplicaciones", "Factory": "Fábrica", "About": "Sobre nosotros", "Contact": "Contacto",
        "Resources": "Recursos", "FAQ": "FAQ", "Get a Quote": "Solicitar cotización", "Request a Quote": "Solicitar cotización",
        "Download Catalog": "Descargar catálogo", "View Products": "Ver productos", "View detail": "Ver detalle", "Request details": "Solicitar detalles",
        "Submit Inquiry": "Enviar consulta", "Contact Sales": "Contactar ventas", "Product Categories": "Categorías de productos",
        "Product Matrix": "Matriz de productos", "High-Speed Slitting Machines": "Máquinas cortadoras de alta velocidad",
        "Nonwoven Rewinding Machines": "Máquinas rebobinadoras de no tejidos", "Automatic Knife Systems": "Sistemas de cuchillas automáticas",
        "Perforating Production Lines": "Líneas de perforación", "Cases & Projects": "Casos y proyectos",
        "Technical Data from Product Manual": "Datos técnicos del manual de producto", "Manual Parameter": "Parámetro del manual",
        "Production Speed": "Velocidad de producción", "Materials": "Materiales", "Air Supply": "Suministro de aire",
        "Installed Power": "Potencia instalada", "Effective Operating Power": "Potencia efectiva de operación",
        "Wilson Wu WhatsApp": "WhatsApp de Wilson Wu", "Manufacturing base": "Base de fabricación",
    },
    "ru": {
        "Products": "Продукция", "Applications": "Применения", "Factory": "Фабрика", "About": "О нас", "Contact": "Контакты",
        "Resources": "Ресурсы", "FAQ": "FAQ", "Get a Quote": "Запросить предложение", "Request a Quote": "Запросить предложение",
        "Download Catalog": "Скачать каталог", "View Products": "Смотреть продукцию", "View detail": "Подробнее", "Request details": "Запросить детали",
        "Submit Inquiry": "Отправить запрос", "Contact Sales": "Связаться с продажами", "Product Categories": "Категории продукции",
        "Product Matrix": "Матрица продукции", "High-Speed Slitting Machines": "Высокоскоростные машины резки",
        "Nonwoven Rewinding Machines": "Машины перемотки нетканых материалов", "Automatic Knife Systems": "Автоматические ножевые системы",
        "Perforating Production Lines": "Линии перфорации", "Cases & Projects": "Проекты и кейсы",
        "Technical Data from Product Manual": "Технические данные из руководства", "Manual Parameter": "Параметр руководства",
        "Production Speed": "Скорость производства", "Materials": "Материалы", "Air Supply": "Подача воздуха",
        "Installed Power": "Установленная мощность", "Effective Operating Power": "Рабочая мощность",
        "Wilson Wu WhatsApp": "WhatsApp Wilson Wu", "Manufacturing base": "Производственная база",
    },
    "ar": {
        "Products": "المنتجات", "Applications": "التطبيقات", "Factory": "المصنع", "About": "من نحن", "Contact": "اتصل بنا",
        "Resources": "الموارد", "FAQ": "الأسئلة الشائعة", "Get a Quote": "اطلب عرض سعر", "Request a Quote": "اطلب عرض سعر",
        "Download Catalog": "تحميل الكتالوج", "View Products": "عرض المنتجات", "View detail": "عرض التفاصيل", "Request details": "طلب التفاصيل",
        "Submit Inquiry": "إرسال الاستفسار", "Contact Sales": "تواصل مع المبيعات", "Product Categories": "فئات المنتجات",
        "Product Matrix": "مصفوفة المنتجات", "High-Speed Slitting Machines": "آلات الشق عالية السرعة",
        "Nonwoven Rewinding Machines": "آلات إعادة لف غير المنسوجات", "Automatic Knife Systems": "أنظمة السكاكين الأوتوماتيكية",
        "Perforating Production Lines": "خطوط التثقيب", "Cases & Projects": "المشاريع والحالات",
        "Technical Data from Product Manual": "البيانات الفنية من دليل المنتج", "Manual Parameter": "معيار الدليل",
        "Production Speed": "سرعة الإنتاج", "Materials": "المواد", "Air Supply": "إمداد الهواء",
        "Installed Power": "القدرة المركبة", "Effective Operating Power": "قدرة التشغيل الفعلية",
        "Wilson Wu WhatsApp": "واتساب Wilson Wu", "Manufacturing base": "قاعدة التصنيع",
    },
    "fr": {
        "Products": "Produits", "Applications": "Applications", "Factory": "Usine", "About": "À propos", "Contact": "Contact",
        "Resources": "Ressources", "FAQ": "FAQ", "Get a Quote": "Demander un devis", "Request a Quote": "Demander un devis",
        "Download Catalog": "Télécharger le catalogue", "View Products": "Voir les produits", "View detail": "Voir le détail", "Request details": "Demander des détails",
        "Submit Inquiry": "Envoyer la demande", "Contact Sales": "Contacter les ventes", "Product Categories": "Catégories de produits",
        "Product Matrix": "Matrice produits", "High-Speed Slitting Machines": "Machines de refente haute vitesse",
        "Nonwoven Rewinding Machines": "Machines de rembobinage non-tissé", "Automatic Knife Systems": "Systèmes de couteaux automatiques",
        "Perforating Production Lines": "Lignes de perforation", "Cases & Projects": "Cas et projets",
        "Technical Data from Product Manual": "Données techniques du manuel produit", "Manual Parameter": "Paramètre du manuel",
        "Production Speed": "Vitesse de production", "Materials": "Matériaux", "Air Supply": "Alimentation en air",
        "Installed Power": "Puissance installée", "Effective Operating Power": "Puissance de fonctionnement",
        "Wilson Wu WhatsApp": "WhatsApp de Wilson Wu", "Manufacturing base": "Base de fabrication",
    },
    "pt": {
        "Products": "Produtos", "Applications": "Aplicações", "Factory": "Fábrica", "About": "Sobre", "Contact": "Contato",
        "Resources": "Recursos", "FAQ": "FAQ", "Get a Quote": "Solicitar cotação", "Request a Quote": "Solicitar cotação",
        "Download Catalog": "Baixar catálogo", "View Products": "Ver produtos", "View detail": "Ver detalhe", "Request details": "Solicitar detalhes",
        "Submit Inquiry": "Enviar consulta", "Contact Sales": "Falar com vendas", "Product Categories": "Categorias de produtos",
        "Product Matrix": "Matriz de produtos", "High-Speed Slitting Machines": "Máquinas de corte de alta velocidade",
        "Nonwoven Rewinding Machines": "Máquinas rebobinadeiras para não tecidos", "Automatic Knife Systems": "Sistemas de facas automáticas",
        "Perforating Production Lines": "Linhas de perfuração", "Cases & Projects": "Casos e projetos",
        "Technical Data from Product Manual": "Dados técnicos do manual do produto", "Manual Parameter": "Parâmetro do manual",
        "Production Speed": "Velocidade de produção", "Materials": "Materiais", "Air Supply": "Suprimento de ar",
        "Installed Power": "Potência instalada", "Effective Operating Power": "Potência efetiva de operação",
        "Wilson Wu WhatsApp": "WhatsApp de Wilson Wu", "Manufacturing base": "Base fabril",
    },
}


def route_to_file(route: str) -> Path:
    return ROOT / "index.html" if route == "/" else ROOT / route.strip("/") / "index.html"


def localized_url(locale: str, route: str) -> str:
    return f"{BASE_URL}/{locale}/" if route == "/" else f"{BASE_URL}/{locale}{route}"


def local_href(from_route: str, to_locale: str, to_route: str) -> str:
    from_dir = Path(to_locale) if from_route == "/" else Path(to_locale) / from_route.strip("/")
    target = Path(to_locale) if to_route == "/" else Path(to_locale) / to_route.strip("/")
    rel = Path(".") if str(from_dir) == str(target) else Path(*([".."] * len(from_dir.parts))) / target
    return str(rel).replace("\\", "/") + "/"


def rel_prefix(route: str) -> str:
    depth = 1 if route == "/" else 1 + len([p for p in route.strip("/").split("/") if p])
    return "../" * depth


def switcher(locale: str, route: str) -> str:
    items = []
    for code, info in LOCALES.items():
        active = " is-active" if code == locale else ""
        items.append(f'<a class="{active.strip()}" hreflang="{code}" href="{local_href(route, code, route)}"><span>{info["native"]}</span><small>{code.upper()}</small></a>')
    return f'<details class="language-switcher"><summary>{locale.upper()}</summary><div class="language-menu">{"".join(items)}</div></details>'


def hreflang(locale: str, route: str) -> str:
    tags = [f'<link rel="alternate" hreflang="{code}" href="{localized_url(code, route)}">' for code in LOCALES]
    tags.append(f'<link rel="alternate" hreflang="x-default" href="{localized_url("en", route)}">')
    return "\n  ".join(tags)


def translate_html(html: str, locale: str, route: str) -> str:
    html = re.sub(r'<html[^>]*lang="[^"]*"[^>]*>', f'<html lang="{locale}" dir="{LOCALES[locale]["dir"]}">', html, count=1)
    title, desc = PAGE_META.get(locale, PAGE_META["en"]).get(route, PAGE_META["en"].get(route, PAGE_META["en"]["/"]))
    h1 = PAGE_H1.get(locale, PAGE_H1["en"]).get(route)
    html = re.sub(r"<title>.*?</title>", f"<title>{escape(title)}</title>", html, count=1, flags=re.S)
    html = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{escape(desc)}">', html, count=1)
    html = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{localized_url(locale, route)}">', html, count=1)
    if 'rel="canonical"' not in html:
        html = html.replace("</title>", f'</title>\n  <link rel="canonical" href="{localized_url(locale, route)}">', 1)
    if 'hreflang=' not in html:
        html = html.replace('<link rel="stylesheet"', hreflang(locale, route) + '\n  <link rel="stylesheet"', 1)
    if h1:
        html = re.sub(r"<h1>.*?</h1>", f"<h1>{escape(h1)}</h1>", html, count=1, flags=re.S)
    if locale != "en":
        for src, dst in sorted(PHRASES.get(locale, {}).items(), key=lambda x: len(x[0]), reverse=True):
            html = html.replace(src, dst)
    html = re.sub(r'((?:href|src)=")((?:\.\./)*assets/)', lambda m: m.group(1) + "../" + m.group(2), html)
    html = re.sub(r'<link rel="stylesheet" href="((?:\.\./)*styles\.css)">', f'<link rel="stylesheet" href="{rel_prefix(route)}styles.css">', html)
    html = re.sub(r'<script src="((?:\.\./)*scripts\.js)"></script>', f'<script src="{rel_prefix(route)}scripts.js"></script>', html)
    html = re.sub(r'<script src="((?:\.\./)*social-links\.js)" defer></script>', f'<script src="{rel_prefix(route)}social-links.js" defer></script>', html)
    html = re.sub(r'<script src="inquiry-form\.js"></script>', f'<script src="{rel_prefix(route)}inquiry/inquiry-form.js"></script>', html)
    if "language-switcher" not in html:
        if 'class="inquiry-brand"' in html:
            html = html.replace('</div>\n\n      <div class="inquiry-grid">', switcher(locale, route) + '</div>\n\n      <div class="inquiry-grid">', 1)
        elif "</header>" in html:
            html = html.replace("</header>", switcher(locale, route) + "</header>", 1)
    return html


def write_messages() -> None:
    msg_dir = ROOT / "i18n" / "messages"
    msg_dir.mkdir(parents=True, exist_ok=True)
    for locale in LOCALES:
        payload = {
            "locale": locale,
            "language": LOCALES[locale],
            "pages": {
                route: {
                    "seoTitle": PAGE_META.get(locale, PAGE_META["en"]).get(route, PAGE_META["en"].get(route, ("", "")))[0],
                    "metaDescription": PAGE_META.get(locale, PAGE_META["en"]).get(route, PAGE_META["en"].get(route, ("", "")))[1],
                    "h1": PAGE_H1.get(locale, PAGE_H1["en"]).get(route, PAGE_H1["en"].get(route, "")),
                }
                for route in BASE_ROUTES
            },
            "common": PHRASES.get(locale, {}),
            "apiProviderPlaceholder": {
                "deeplApiKeyEnv": "DEEPL_API_KEY",
                "googleCloudTranslationKeyEnv": "GOOGLE_CLOUD_TRANSLATION_API_KEY",
                "note": "Use these environment variables if the static dictionary is later regenerated through a translation API.",
            },
        }
        (msg_dir / f"{locale}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def build() -> None:
    write_messages()
    for locale in LOCALES:
        target = ROOT / locale
        if target.exists():
            shutil.rmtree(target)
        target.mkdir()
        for route in BASE_ROUTES:
            src = route_to_file(route)
            if not src.exists():
                continue
            html = src.read_text(encoding="utf-8")
            out_html = translate_html(html, locale, route)
            out_file = target / "index.html" if route == "/" else target / route.strip("/") / "index.html"
            out_file.parent.mkdir(parents=True, exist_ok=True)
            out_file.write_text(out_html, encoding="utf-8")
    locs = []
    for route in BASE_ROUTES:
        for locale in LOCALES:
            locs.append(f"  <url><loc>{localized_url(locale, route)}</loc></url>")
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(locs) + "\n</urlset>\n"
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")


if __name__ == "__main__":
    build()
