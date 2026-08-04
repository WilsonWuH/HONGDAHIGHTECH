import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const BASE_URL = "https://www.hdpth.com";

const locales = {
  en: { name: "English", native: "English", dir: "ltr" },
  es: { name: "Spanish", native: "Español", dir: "ltr" },
  ru: { name: "Russian", native: "Русский", dir: "ltr" },
  ar: { name: "Arabic", native: "العربية", dir: "rtl" },
  fr: { name: "French", native: "Français", dir: "ltr" },
  pt: { name: "Portuguese", native: "Português", dir: "ltr" },
  zh: { name: "Chinese", native: "中文", dir: "ltr" }
};

const localeCodes = Object.keys(locales);

const routes = [
  "/",
  "/products/",
  "/products/high-speed-slitting-machines/",
  "/products/nonwoven-rewinding-machines/",
  "/products/automatic-knife-systems/",
  "/products/slitting-rewinding-lines/",
  "/products/auxiliary-equipment/",
  "/products/nonwoven-drying-ovens/",
  "/applications/",
  "/about/",
  "/factory/",
  "/cases/",
  "/blog/",
  "/resources/",
  "/faq/",
  "/contact/",
  "/inquiry/",
  "/download/",
  "/guides/nonwoven-slitting-machine-buying-guide/"
];

const extraSitemapRoutes = [
  "/blog/slitter-rewinder-inspection-system/",
  "/blog/slitter-rewinder-dust-extraction-guide/",
  "/blog/automatic-core-loading-turret-slitter-rewinder/",
  "/blog/turret-slitter-rewinder-buyer-guide/",
  "/blog/load-cell-vs-dancer-tension-control-slitter-rewinder/",
  "/blog/ce-marking-slitter-rewinder-buyer-checklist/",
  "/blog/bowed-spreader-roll-slitter-rewinder/",
  "/blog/slitter-rewinder-roll-unloading-system/",
  "/blog/simplex-vs-duplex-slitter-rewinder/",
  "/blog/slitter-rewinder-static-control/",
  "/blog/web-guide-sensor-slitter-rewinder/",
  "/blog/slitter-rewinder-production-capacity/"
];

const extraSitemapLastmod = {
  "/blog/slitter-rewinder-inspection-system/": "2026-07-19",
  "/blog/web-guide-sensor-slitter-rewinder/": "2026-08-03",
  "/blog/slitter-rewinder-production-capacity/": "2026-08-04"
};

const meta = {
  en: {
    "/": ["HDPTH | High-Speed Nonwoven Converting Machinery", "HDPTH manufactures nonwoven slitting, rewinding, perforating and automatic knife systems for overseas B2B manufacturers.", "High-Speed Nonwoven Converting Machinery"],
    "/products/": ["Products | HDPTH Nonwoven Converting Machinery", "Explore HDPTH slitting machines, rewinding machines, perforating production lines, automatic knife systems and auxiliary converting equipment.", "Nonwoven Converting Machinery"],
    "/products/high-speed-slitting-machines/": ["High-Speed Nonwoven Slitting Machine | Low Noise Multi-Material Slitter | HDPTH", "Upgraded HDPTH high-speed nonwoven slitting machine for spunbond, spunlace, meltblown, flushable, film and paper rolls. Lower noise, lower vibration, custom widths.", "High-Speed Nonwoven Slitting Machines"],
    "/products/nonwoven-rewinding-machines/": ["Nonwoven Rewinding Machine | Wide Roll Winder for Stable Rolls | HDPTH", "HDPTH nonwoven rewinding machine and wide roll winder for stable roll formation, controlled tension, spunlace, spunbond, film and paper converting projects.", "Nonwoven Rewinding Machines"],
    "/products/automatic-knife-systems/": ["Automatic Knife Systems for Nonwoven Converting | HDPTH", "Automatic knife systems for faster setup, repeatable slitting configuration and HDPTH high-speed converting lines.", "Automatic Knife Systems"],
    "/products/slitting-rewinding-lines/": ["Slitting and Rewinding Lines for Wide Roll Materials | HDPTH", "Integrated slitting and rewinding lines for nonwoven, paper and flexible wide roll materials with custom unwind, cutting and roll handling layouts.", "Integrated Slitting and Rewinding Lines"],
    "/products/auxiliary-equipment/": ["Edge Trim Rewinding and Auxiliary Equipment | HDPTH", "HDPTH auxiliary equipment supports edge trim rewinding, automatic unwinding, shaft pulling and cleaner roll-material converting operations.", "Edge Trim Rewinding and Auxiliary Equipment"],
    "/products/nonwoven-drying-ovens/": ["Nonwoven Drying Oven Systems | HDPTH", "Industrial hot-air drying oven systems for nonwoven production lines with custom web width, airflow and line integration.", "Nonwoven Drying Oven Systems"],
    "/applications/": ["Applications | HDPTH Nonwoven Machinery", "Applications for HDPTH nonwoven converting machinery in hygiene, medical, wipes and industrial roll material production.", "Nonwoven Machinery Applications"],
    "/about/": ["About HDPTH | Nonwoven Machinery Manufacturer", "Learn about HDPTH, a China-based manufacturer of nonwoven slitting, rewinding, perforating and auxiliary converting machinery.", "About HDPTH"],
    "/factory/": ["HDPTH Factory & Production Workshop | Nonwoven Machinery", "See HDPTH's real 6,000 m2 production workshop, machinery assembly area and manufacturing capability for nonwoven converting equipment.", "HDPTH Production Workshop"],
    "/cases/": ["Cases & Projects | HDPTH Nonwoven Machinery", "HDPTH project examples and customer-site references for overseas buyers evaluating nonwoven slitting, rewinding and converting machinery.", "Cases & Projects"],
    "/blog/": ["Blog | HDPTH Nonwoven Converting Machinery", "Technical buyer guides and converting knowledge for nonwoven slitting, rewinding, tension control and roll-material processing.", "HDPTH Blog"],
    "/resources/": ["Resources | HDPTH Nonwoven Machinery Guides", "Buyer guides and SEO resources for selecting nonwoven slitting, rewinding and converting equipment.", "Buyer Resources"],
    "/faq/": ["FAQ | Nonwoven Slitting & Rewinding Machines | HDPTH", "Buyer FAQ for HDPTH nonwoven slitting machines, rewinding machines, perforating lines and automatic knife systems.", "Buyer FAQ"],
    "/contact/": ["Contact HDPTH | Request a Quote", "Contact Wilson Wu at HDPTH to request a quote for nonwoven slitting, rewinding and converting machinery.", "Request a Machine Configuration"],
    "/inquiry/": ["Inquiry Form | HDPTH Nonwoven Machinery", "Send an RFQ to HDPTH for nonwoven slitting, rewinding, perforating and converting machinery.", "Tell us your production requirement."],
    "/download/": ["Download Catalog | HDPTH", "Request the HDPTH catalog for nonwoven slitting, rewinding, perforating and automatic knife systems.", "Download HDPTH Catalog"],
    "/guides/nonwoven-slitting-machine-buying-guide/": ["Nonwoven Slitting Machine Buying Guide | HDPTH", "A practical buying guide for nonwoven slitting machines covering material, roll width, speed, knife system and RFQ information.", "How to Choose a Nonwoven Slitting Machine"]
  },
  es: {
    "/": ["HDPTH | Maquinaria de conversión de no tejidos de alta velocidad", "HDPTH fabrica cortadoras, rebobinadoras, líneas de perforación y sistemas de cuchillas automáticas para fabricantes B2B internacionales.", "Maquinaria de conversión de no tejidos de alta velocidad"],
    "/products/": ["Productos | Maquinaria HDPTH para no tejidos", "Explore cortadoras, rebobinadoras, líneas de perforación, sistemas de cuchillas automáticas y equipos auxiliares HDPTH.", "Maquinaria de conversión para no tejidos"],
    "/products/high-speed-slitting-machines/": ["Cortadoras de no tejido de alta velocidad | HDPTH", "Cortadoras HDPTH actualizadas para reducir ruido y vibración, compatibles con spunbond, spunlace, punzonado, pulpa de madera, meltblown, compuestos, materiales dispersables, aire caliente, film y papel.", "Cortadoras de no tejido de alta velocidad"],
    "/products/nonwoven-rewinding-machines/": ["Rebobinadora de no tejidos | Winder de rollos anchos | HDPTH", "Rebobinadora HDPTH para rollos no tejidos estables, tensión controlada, spunlace, spunbond, film y papel.", "Rebobinadoras de no tejidos"],
    "/products/automatic-knife-systems/": ["Sistemas de cuchillas automáticas | HDPTH", "Sistemas de cuchillas automáticas para cambios rápidos, configuración repetible y líneas de conversión HDPTH.", "Sistemas de cuchillas automáticas"],
    "/products/slitting-rewinding-lines/": ["Líneas de corte y rebobinado para rollos anchos | HDPTH", "Líneas integradas de corte y rebobinado para no tejidos, papel y materiales flexibles en rollo.", "Líneas integradas de corte y rebobinado"],
    "/products/auxiliary-equipment/": ["Equipos auxiliares y rebobinado de recortes | HDPTH", "Equipos auxiliares HDPTH para rebobinado de recortes, desenrollado automático, extracción de ejes y operaciones más limpias.", "Equipos auxiliares y rebobinado de recortes"],
    "/products/nonwoven-drying-ovens/": ["Hornos de secado para no tejidos | HDPTH", "Sistemas industriales de secado por aire caliente para líneas de no tejidos con ancho, flujo de aire e integración personalizados.", "Hornos de secado para no tejidos"],
    "/applications/": ["Aplicaciones | Maquinaria HDPTH", "Aplicaciones de maquinaria HDPTH en higiene, medicina, toallitas y materiales industriales en rollo.", "Aplicaciones de maquinaria para no tejidos"],
    "/about/": ["Sobre HDPTH | Fabricante de maquinaria para no tejidos", "Conozca HDPTH, fabricante chino de maquinaria de corte, rebobinado, perforación y equipos auxiliares para no tejidos.", "Sobre HDPTH"],
    "/factory/": ["Fábrica y taller de producción HDPTH", "Vea el taller real de 6.000 m2 de HDPTH y su capacidad de fabricación de maquinaria para no tejidos.", "Taller de producción HDPTH"],
    "/cases/": ["Casos y proyectos | HDPTH", "Ejemplos de proyectos y referencias en planta para compradores internacionales de maquinaria de conversión de no tejidos.", "Casos y proyectos"],
    "/blog/": ["Blog | Maquinaria de conversión HDPTH", "Guías técnicas para compradores sobre corte, rebobinado, control de tensión y procesamiento de materiales en rollo.", "Blog de HDPTH"],
    "/resources/": ["Recursos | Guías HDPTH", "Guías para compradores que seleccionan equipos de corte, rebobinado y conversión de no tejidos.", "Recursos para compradores"],
    "/faq/": ["FAQ | Cortadoras y rebobinadoras HDPTH", "Preguntas frecuentes para compradores de cortadoras, rebobinadoras, líneas de perforación y sistemas de cuchillas HDPTH.", "Preguntas frecuentes"],
    "/contact/": ["Contactar HDPTH | Solicitar cotización", "Contacte con Wilson Wu en HDPTH para solicitar una cotización de maquinaria de conversión de no tejidos.", "Solicitar configuración de máquina"],
    "/inquiry/": ["Formulario de consulta | HDPTH", "Envíe una RFQ a HDPTH para maquinaria de corte, rebobinado, perforación y conversión.", "Indique sus requisitos de producción."],
    "/download/": ["Descargar catálogo | HDPTH", "Solicite el catálogo HDPTH de cortadoras, rebobinadoras, líneas de perforación y sistemas de cuchillas automáticas.", "Descargar catálogo HDPTH"],
    "/guides/nonwoven-slitting-machine-buying-guide/": ["Guía de compra de cortadoras de no tejido | HDPTH", "Guía práctica para elegir cortadoras de no tejido según material, ancho de rollo, velocidad, cuchillas e información RFQ.", "Cómo elegir una cortadora de no tejido"]
  },
  ru: {
    "/": ["HDPTH | Высокоскоростное оборудование для переработки нетканых материалов", "HDPTH производит машины для резки, перемотки, перфорации и автоматические ножевые системы для международных B2B производителей.", "Высокоскоростное оборудование для переработки нетканых материалов"],
    "/products/": ["Продукция | Оборудование HDPTH для нетканых материалов", "Оборудование HDPTH для резки, перемотки, перфорации, автоматической настройки ножей и вспомогательных операций.", "Оборудование для переработки нетканых материалов"],
    "/products/high-speed-slitting-machines/": ["Высокоскоростные машины резки нетканых материалов | HDPTH", "Обновленные высокоскоростные машины HDPTH снижают шум и вибрацию и подходят для spunbond, spunlace, иглопробивных, древесно-целлюлозных, meltblown, композитных, смываемых, hot-air, пленочных и бумажных материалов.", "Высокоскоростные машины резки нетканых материалов"],
    "/products/nonwoven-rewinding-machines/": ["Машина перемотки нетканых материалов | Wide Roll Winder | HDPTH", "Машины HDPTH для стабильной перемотки рулонов, контролируемого натяжения, spunlace, spunbond, пленки и бумаги.", "Машины перемотки нетканых материалов"],
    "/products/automatic-knife-systems/": ["Автоматические ножевые системы | HDPTH", "Автоматические ножевые системы для быстрой настройки, повторяемой резки и линий переработки HDPTH.", "Автоматические ножевые системы"],
    "/products/slitting-rewinding-lines/": ["Линии резки и перемотки широких рулонов | HDPTH", "Интегрированные линии резки и перемотки для нетканых материалов, бумаги и гибких рулонных материалов.", "Интегрированные линии резки и перемотки"],
    "/products/auxiliary-equipment/": ["Вспомогательное оборудование и перемотка кромки | HDPTH", "Вспомогательное оборудование HDPTH для перемотки кромки, автоматической размотки, извлечения валов и чистой работы линии.", "Вспомогательное оборудование и перемотка кромки"],
    "/products/nonwoven-drying-ovens/": ["Сушильные печи для нетканых материалов | HDPTH", "Промышленные системы горячевоздушной сушки для линий нетканых материалов с индивидуальной шириной и интеграцией.", "Сушильные печи для нетканых материалов"],
    "/applications/": ["Области применения | HDPTH", "Применение оборудования HDPTH в гигиене, медицине, салфетках и промышленных рулонных материалах.", "Применение оборудования для нетканых материалов"],
    "/about/": ["О компании HDPTH | Производитель оборудования", "HDPTH — китайский производитель оборудования для резки, перемотки, перфорации и вспомогательных операций.", "О компании HDPTH"],
    "/factory/": ["Фабрика и производственный цех HDPTH", "Посмотрите реальный производственный цех HDPTH площадью 6 000 м2 и возможности сборки оборудования.", "Производственный цех HDPTH"],
    "/cases/": ["Кейсы и проекты | HDPTH", "Примеры проектов и фотографии площадок клиентов для покупателей оборудования переработки нетканых материалов.", "Кейсы и проекты"],
    "/blog/": ["Блог | Оборудование HDPTH", "Технические руководства для покупателей по резке, перемотке, натяжению и переработке рулонных материалов.", "Блог HDPTH"],
    "/resources/": ["Ресурсы | Руководства HDPTH", "Руководства для выбора оборудования резки, перемотки и переработки нетканых материалов.", "Ресурсы для покупателей"],
    "/faq/": ["FAQ | Машины резки и перемотки HDPTH", "Частые вопросы покупателей о машинах HDPTH для резки, перемотки, перфорации и автоматических ножевых системах.", "Частые вопросы"],
    "/contact/": ["Связаться с HDPTH | Запросить предложение", "Свяжитесь с Wilson Wu в HDPTH, чтобы запросить предложение по оборудованию для переработки нетканых материалов.", "Запрос конфигурации машины"],
    "/inquiry/": ["Форма запроса | HDPTH", "Отправьте RFQ в HDPTH для оборудования резки, перемотки, перфорации и переработки.", "Расскажите о ваших производственных требованиях."],
    "/download/": ["Скачать каталог | HDPTH", "Запросите каталог HDPTH для машин резки, перемотки, перфорации и автоматических ножевых систем.", "Скачать каталог HDPTH"],
    "/guides/nonwoven-slitting-machine-buying-guide/": ["Руководство по выбору машины резки нетканых материалов | HDPTH", "Практическое руководство по выбору машины резки с учетом материала, ширины рулона, скорости, ножевой системы и RFQ.", "Как выбрать машину резки нетканых материалов"]
  },
  ar: {
    "/": ["HDPTH | معدات تحويل الأقمشة غير المنسوجة عالية السرعة", "تصنع HDPTH آلات الشق وإعادة اللف والتثقيب وأنظمة السكاكين الأوتوماتيكية لمصنعي B2B حول العالم.", "معدات تحويل الأقمشة غير المنسوجة عالية السرعة"],
    "/products/": ["المنتجات | معدات HDPTH للأقمشة غير المنسوجة", "استكشف آلات الشق وإعادة اللف وخطوط التثقيب وأنظمة السكاكين الأوتوماتيكية والمعدات المساعدة من HDPTH.", "معدات تحويل الأقمشة غير المنسوجة"],
    "/products/high-speed-slitting-machines/": ["آلات شق الأقمشة غير المنسوجة عالية السرعة | HDPTH", "آلات HDPTH المطورة تقلل الضوضاء والاهتزاز وتدعم مواد spunbond وspunlace والمثقوبة بالإبر ولب الخشب وmeltblown والمركبة والقابلة للتشتت والهواء الساخن والأفلام والورق.", "آلات شق الأقمشة غير المنسوجة عالية السرعة"],
    "/products/nonwoven-rewinding-machines/": ["آلة إعادة لف الأقمشة غير المنسوجة | HDPTH", "آلة HDPTH لإعادة لف الرولات غير المنسوجة بتكوين مستقر وشد متحكم به لمواد spunlace وspunbond والأفلام والورق.", "آلات إعادة لف الأقمشة غير المنسوجة"],
    "/products/automatic-knife-systems/": ["أنظمة السكاكين الأوتوماتيكية | HDPTH", "أنظمة سكاكين أوتوماتيكية للإعداد السريع والقطع المتكرر وخطوط تحويل HDPTH.", "أنظمة السكاكين الأوتوماتيكية"],
    "/products/slitting-rewinding-lines/": ["خطوط الشق وإعادة اللف لللفات العريضة | HDPTH", "خطوط متكاملة للشق وإعادة اللف للأقمشة غير المنسوجة والورق والمواد المرنة الملفوفة.", "خطوط شق وإعادة لف متكاملة"],
    "/products/auxiliary-equipment/": ["المعدات المساعدة وإعادة لف الحواف | HDPTH", "معدات HDPTH المساعدة لإعادة لف الحواف، والفك الأوتوماتيكي، وسحب الأعمدة، وتشغيل أنظف للخط.", "المعدات المساعدة وإعادة لف الحواف"],
    "/products/nonwoven-drying-ovens/": ["أنظمة أفران تجفيف الأقمشة غير المنسوجة | HDPTH", "أنظمة تجفيف صناعية بالهواء الساخن لخطوط الأقمشة غير المنسوجة مع عرض وتدفق هواء وتكامل مخصص.", "أنظمة أفران تجفيف الأقمشة غير المنسوجة"],
    "/applications/": ["التطبيقات | معدات HDPTH", "تطبيقات معدات HDPTH في منتجات النظافة والطب والمناديل والمواد الصناعية الملفوفة.", "تطبيقات معدات الأقمشة غير المنسوجة"],
    "/about/": ["حول HDPTH | مصنع معدات الأقمشة غير المنسوجة", "تعرف على HDPTH، وهي شركة صينية لتصنيع معدات الشق وإعادة اللف والتثقيب والمعدات المساعدة.", "حول HDPTH"],
    "/factory/": ["مصنع وورشة إنتاج HDPTH", "شاهد ورشة HDPTH الحقيقية بمساحة 6,000 متر مربع وقدرتها على تصنيع معدات تحويل الأقمشة غير المنسوجة.", "ورشة إنتاج HDPTH"],
    "/cases/": ["الحالات والمشاريع | HDPTH", "أمثلة مشاريع وصور مواقع عملاء لمساعدة المشترين الدوليين على تقييم معدات تحويل الأقمشة غير المنسوجة.", "الحالات والمشاريع"],
    "/blog/": ["مدونة HDPTH | معدات التحويل", "أدلة فنية للمشترين حول الشق وإعادة اللف والتحكم في الشد ومعالجة المواد الملفوفة.", "مدونة HDPTH"],
    "/resources/": ["الموارد | أدلة HDPTH", "أدلة للمشترين لاختيار معدات الشق وإعادة اللف والتحويل.", "موارد المشترين"],
    "/faq/": ["الأسئلة الشائعة | آلات HDPTH", "أسئلة شائعة للمشترين حول آلات HDPTH للشق وإعادة اللف والتثقيب وأنظمة السكاكين.", "الأسئلة الشائعة للمشترين"],
    "/contact/": ["اتصل بـ HDPTH | اطلب عرض سعر", "تواصل مع Wilson Wu في HDPTH لطلب عرض سعر لمعدات تحويل الأقمشة غير المنسوجة.", "اطلب تكوين آلة"],
    "/inquiry/": ["نموذج الاستفسار | HDPTH", "أرسل RFQ إلى HDPTH لمعدات الشق وإعادة اللف والتثقيب والتحويل.", "أخبرنا بمتطلبات الإنتاج لديك."],
    "/download/": ["تحميل الكتالوج | HDPTH", "اطلب كتالوج HDPTH لآلات الشق وإعادة اللف والتثقيب وأنظمة السكاكين الأوتوماتيكية.", "تحميل كتالوج HDPTH"],
    "/guides/nonwoven-slitting-machine-buying-guide/": ["دليل شراء آلة شق الأقمشة غير المنسوجة | HDPTH", "دليل عملي لاختيار آلة الشق حسب المادة وعرض اللفة والسرعة ونظام السكاكين ومعلومات RFQ.", "كيفية اختيار آلة شق للأقمشة غير المنسوجة"]
  },
  fr: {
    "/": ["HDPTH | Machines de conversion non-tissé haute vitesse", "HDPTH fabrique des machines de refente, rembobinage, perforation et systèmes de couteaux automatiques pour fabricants B2B internationaux.", "Machines de conversion non-tissé haute vitesse"],
    "/products/": ["Produits | Machines HDPTH pour non-tissés", "Découvrez les machines HDPTH de refente, rembobinage, perforation, couteaux automatiques et équipements auxiliaires.", "Machines de conversion pour non-tissés"],
    "/products/high-speed-slitting-machines/": ["Machines de refente non-tissé haute vitesse | HDPTH", "Machines de refente HDPTH mises à niveau pour réduire le bruit et les vibrations, compatibles avec spunbond, spunlace, aiguilleté, pâte de bois, meltblown, composite, dispersible, air chaud, film et papier.", "Machines de refente non-tissé haute vitesse"],
    "/products/nonwoven-rewinding-machines/": ["Machine de rembobinage non-tissé | Wide Roll Winder | HDPTH", "Rembobineuse HDPTH pour rouleaux stables, tension contrôlée, spunlace, spunbond, film et papier.", "Machines de rembobinage non-tissé"],
    "/products/automatic-knife-systems/": ["Systèmes de couteaux automatiques | HDPTH", "Systèmes de couteaux automatiques pour réglage rapide, refente répétable et lignes de conversion HDPTH.", "Systèmes de couteaux automatiques"],
    "/products/slitting-rewinding-lines/": ["Lignes de refente et rembobinage pour rouleaux larges | HDPTH", "Lignes intégrées de refente et rembobinage pour non-tissés, papier et matériaux flexibles en rouleaux.", "Lignes intégrées de refente et rembobinage"],
    "/products/auxiliary-equipment/": ["Équipements auxiliaires et rembobinage de rives | HDPTH", "Équipements auxiliaires HDPTH pour rembobinage de rives, déroulage automatique, extraction d'arbres et opérations plus propres.", "Équipements auxiliaires et rembobinage de rives"],
    "/products/nonwoven-drying-ovens/": ["Systèmes de fours de séchage non-tissé | HDPTH", "Systèmes industriels de séchage à air chaud pour lignes non-tissées avec largeur, flux d'air et intégration personnalisés.", "Systèmes de fours de séchage non-tissé"],
    "/applications/": ["Applications | Machines HDPTH", "Applications des machines HDPTH dans l'hygiène, le médical, les lingettes et les matériaux industriels en rouleaux.", "Applications des machines non-tissées"],
    "/about/": ["À propos de HDPTH | Fabricant de machines non-tissées", "Découvrez HDPTH, fabricant chinois de machines de refente, rembobinage, perforation et équipements auxiliaires.", "À propos de HDPTH"],
    "/factory/": ["Usine et atelier de production HDPTH", "Découvrez l'atelier réel de 6 000 m2 de HDPTH et sa capacité de fabrication de machines non-tissées.", "Atelier de production HDPTH"],
    "/cases/": ["Cas et projets | HDPTH", "Exemples de projets et références de sites clients pour acheteurs internationaux de machines de conversion non-tissé.", "Cas et projets"],
    "/blog/": ["Blog | Machines de conversion HDPTH", "Guides techniques pour acheteurs sur la refente, le rembobinage, le contrôle de tension et les matériaux en rouleaux.", "Blog HDPTH"],
    "/resources/": ["Ressources | Guides HDPTH", "Guides d'achat pour choisir des équipements de refente, rembobinage et conversion non-tissé.", "Ressources acheteurs"],
    "/faq/": ["FAQ | Machines de refente et rembobinage HDPTH", "Questions fréquentes sur les machines HDPTH de refente, rembobinage, perforation et systèmes de couteaux.", "FAQ acheteurs"],
    "/contact/": ["Contacter HDPTH | Demander un devis", "Contactez Wilson Wu chez HDPTH pour demander un devis de machines de conversion non-tissé.", "Demander une configuration machine"],
    "/inquiry/": ["Formulaire de demande | HDPTH", "Envoyez une RFQ à HDPTH pour machines de refente, rembobinage, perforation et conversion.", "Indiquez votre besoin de production."],
    "/download/": ["Télécharger le catalogue | HDPTH", "Demandez le catalogue HDPTH pour machines de refente, rembobinage, perforation et systèmes de couteaux automatiques.", "Télécharger le catalogue HDPTH"],
    "/guides/nonwoven-slitting-machine-buying-guide/": ["Guide d'achat de machine de refente non-tissé | HDPTH", "Guide pratique pour choisir une machine de refente selon matériau, largeur, vitesse, système de couteaux et RFQ.", "Comment choisir une machine de refente non-tissé"]
  },
  pt: {
    "/": ["HDPTH | Máquinas de conversão para não tecidos de alta velocidade", "A HDPTH fabrica cortadeiras, rebobinadeiras, linhas de perfuração e sistemas de facas automáticas para fabricantes B2B globais.", "Máquinas de conversão para não tecidos de alta velocidade"],
    "/products/": ["Produtos | Máquinas HDPTH para não tecidos", "Explore máquinas HDPTH de corte, rebobinamento, perfuração, sistemas de facas automáticas e equipamentos auxiliares.", "Máquinas de conversão para não tecidos"],
    "/products/high-speed-slitting-machines/": ["Máquinas de corte de não tecido de alta velocidade | HDPTH", "Máquinas HDPTH atualizadas reduzem ruído e vibração e processam spunbond, spunlace, agulhado, polpa de madeira, meltblown, compostos, dispersíveis, hot-air, filme e papel.", "Máquinas de corte de não tecido de alta velocidade"],
    "/products/nonwoven-rewinding-machines/": ["Máquina rebobinadeira para não tecidos | Wide Roll Winder | HDPTH", "Rebobinadeira HDPTH para rolos estáveis, tensão controlada, spunlace, spunbond, filme e papel.", "Máquinas rebobinadeiras para não tecidos"],
    "/products/automatic-knife-systems/": ["Sistemas de facas automáticas | HDPTH", "Sistemas de facas automáticas para setup rápido, corte repetível e linhas de conversão HDPTH.", "Sistemas de facas automáticas"],
    "/products/slitting-rewinding-lines/": ["Linhas de corte e rebobinamento para rolos largos | HDPTH", "Linhas integradas de corte e rebobinamento para não tecidos, papel e materiais flexíveis em rolo.", "Linhas integradas de corte e rebobinamento"],
    "/products/auxiliary-equipment/": ["Equipamentos auxiliares e rebobinamento de aparas | HDPTH", "Equipamentos auxiliares HDPTH para rebobinamento de aparas, desenrolamento automático, extração de eixos e operações mais limpas.", "Equipamentos auxiliares e rebobinamento de aparas"],
    "/products/nonwoven-drying-ovens/": ["Sistemas de fornos de secagem para não tecidos | HDPTH", "Sistemas industriais de secagem por ar quente para linhas de não tecidos com largura, fluxo de ar e integração personalizados.", "Sistemas de fornos de secagem para não tecidos"],
    "/applications/": ["Aplicações | Máquinas HDPTH", "Aplicações das máquinas HDPTH em higiene, medicina, lenços e materiais industriais em rolo.", "Aplicações de máquinas para não tecidos"],
    "/about/": ["Sobre a HDPTH | Fabricante de máquinas para não tecidos", "Conheça a HDPTH, fabricante chinesa de máquinas de corte, rebobinamento, perfuração e equipamentos auxiliares.", "Sobre a HDPTH"],
    "/factory/": ["Fábrica e oficina de produção HDPTH", "Veja a oficina real de 6.000 m2 da HDPTH e sua capacidade de fabricação de máquinas para não tecidos.", "Oficina de produção HDPTH"],
    "/cases/": ["Casos e projetos | HDPTH", "Exemplos de projetos e referências em plantas de clientes para compradores globais de máquinas de conversão.", "Casos e projetos"],
    "/blog/": ["Blog | Máquinas de conversão HDPTH", "Guias técnicos para compradores sobre corte, rebobinamento, controle de tensão e processamento de materiais em rolo.", "Blog HDPTH"],
    "/resources/": ["Recursos | Guias HDPTH", "Guias para compradores que selecionam equipamentos de corte, rebobinamento e conversão para não tecidos.", "Recursos para compradores"],
    "/faq/": ["FAQ | Máquinas de corte e rebobinamento HDPTH", "Perguntas frequentes sobre máquinas HDPTH de corte, rebobinamento, perfuração e sistemas de facas.", "Perguntas frequentes"],
    "/contact/": ["Contato HDPTH | Solicitar cotação", "Fale com Wilson Wu da HDPTH para solicitar cotação de máquinas de conversão para não tecidos.", "Solicitar configuração de máquina"],
    "/inquiry/": ["Formulário de consulta | HDPTH", "Envie uma RFQ à HDPTH para máquinas de corte, rebobinamento, perfuração e conversão.", "Informe seu requisito de produção."],
    "/download/": ["Baixar catálogo | HDPTH", "Solicite o catálogo HDPTH de máquinas de corte, rebobinamento, perfuração e sistemas de facas automáticas.", "Baixar catálogo HDPTH"],
    "/guides/nonwoven-slitting-machine-buying-guide/": ["Guia de compra de máquina de corte de não tecido | HDPTH", "Guia prático para escolher uma máquina de corte conforme material, largura do rolo, velocidade, sistema de facas e RFQ.", "Como escolher uma máquina de corte de não tecido"]
  },
  zh: {
    "/": ["HDPTH | 高速无纺布后整理与分切复卷设备", "HDPTH 为全球 B2B 制造商提供无纺布分切、复卷、打孔、自动排刀及辅助后整理设备。", "高速无纺布后整理与分切复卷设备"],
    "/products/": ["产品中心 | HDPTH 无纺布后整理设备", "了解 HDPTH 分切机、复卷机、打孔生产线、自动排刀系统及辅助后整理设备。", "无纺布后整理设备"],
    "/products/high-speed-slitting-machines/": ["高速无纺布分切机 | HDPTH", "升级版 HDPTH 高速分切机通过驱动系统与基础工艺升级降低运行噪声和振动，并支持纺粘、水刺、针刺、木浆、熔喷、复合、可冲散、热风、薄膜、纸张等材料。", "高速无纺布分切机"],
    "/products/nonwoven-rewinding-machines/": ["无纺布复卷机 | 宽幅卷材稳定成卷设备 | HDPTH", "HDPTH 无纺布复卷机用于宽幅卷材稳定成卷、张力控制，适合水刺、纺粘、薄膜、纸张等后整理项目。", "无纺布复卷机"],
    "/products/automatic-knife-systems/": ["自动排刀系统 | HDPTH", "自动排刀系统用于快速换规格、重复性分切配置和 HDPTH 高速后整理产线。", "自动排刀系统"],
    "/products/slitting-rewinding-lines/": ["宽幅卷材分切复卷联线 | HDPTH", "面向无纺布、纸张及柔性卷材的集成式分切复卷联线，支持定制放卷、分切和收卷布局。", "集成式分切复卷联线"],
    "/products/auxiliary-equipment/": ["边料复卷与辅助设备 | HDPTH", "HDPTH 辅助设备支持边料复卷、自动开卷/退卷、自动拔轴和更整洁的卷材后整理流程。", "边料复卷与辅助设备"],
    "/products/nonwoven-drying-ovens/": ["无纺布烘箱系统 | HDPTH", "面向无纺布生产线的工业热风烘干系统，可按幅宽、风量和产线集成要求定制。", "无纺布烘箱系统"],
    "/applications/": ["应用领域 | HDPTH 无纺布设备", "HDPTH 无纺布后整理设备适用于卫生用品、医疗材料、湿巾及工业卷材生产。", "无纺布设备应用领域"],
    "/about/": ["关于 HDPTH | 无纺布后整理设备制造商", "了解 HDPTH：中国无纺布分切、复卷、打孔及辅助后整理设备制造商。", "关于 HDPTH"],
    "/factory/": ["HDPTH 工厂与生产车间", "查看 HDPTH 真实 6000 平方米生产基地、设备装配区和无纺布后整理设备制造能力。", "HDPTH 生产车间"],
    "/cases/": ["案例与项目 | HDPTH 无纺布设备", "面向海外买家的 HDPTH 项目案例和客户现场参考，用于评估分切、复卷及后整理设备能力。", "案例与项目"],
    "/blog/": ["博客 | HDPTH 无纺布后整理设备", "关于无纺布分切、复卷、张力控制和卷材处理的技术采购指南。", "HDPTH 博客"],
    "/resources/": ["资源中心 | HDPTH 采购指南", "帮助买家选择无纺布分切、复卷和后整理设备的资料与指南。", "采购资源"],
    "/faq/": ["常见问题 | HDPTH 分切复卷设备", "关于 HDPTH 分切机、复卷机、打孔线和自动排刀系统的买家常见问题。", "买家常见问题"],
    "/contact/": ["联系 HDPTH | 获取报价", "联系 HDPTH Wilson Wu，获取无纺布分切、复卷和后整理设备报价。", "提交设备配置需求"],
    "/inquiry/": ["询盘表单 | HDPTH 无纺布设备", "向 HDPTH 提交无纺布分切、复卷、打孔和后整理设备 RFQ。", "告诉我们您的生产需求"],
    "/download/": ["下载目录 | HDPTH", "申请 HDPTH 无纺布分切、复卷、打孔和自动排刀系统产品目录。", "下载 HDPTH 产品目录"],
    "/guides/nonwoven-slitting-machine-buying-guide/": ["无纺布分切机采购指南 | HDPTH", "实用采购指南：从材料、母卷幅宽、速度、刀具系统和 RFQ 信息选择无纺布分切机。", "如何选择无纺布分切机"]
  }
};

const common = {
  es: {
    "Products": "Productos", "Applications": "Aplicaciones", "Factory": "Fábrica", "Cases": "Casos", "Certificates": "Certificados", "Blog": "Blog", "News": "Noticias", "About": "Sobre nosotros", "Contact": "Contacto", "FAQ": "FAQ", "Resources": "Recursos",
    "Get a Quote": "Solicitar cotización", "Request a Quote": "Solicitar cotización", "Submit Inquiry": "Enviar consulta", "Contact Sales": "Contactar ventas", "View detail": "Ver detalle", "View machine": "Ver máquina", "Request details": "Solicitar detalles", "Send RFQ": "Enviar RFQ", "Request Catalog": "Solicitar catálogo",
    "Product Matrix": "Matriz de productos", "Product Categories": "Categorías de productos", "High-Speed Slitting Machines": "Cortadoras de alta velocidad", "Nonwoven Rewinding Machines": "Rebobinadoras de no tejidos", "Automatic Knife Systems": "Sistemas de cuchillas automáticas", "Perforating Production Lines": "Líneas de perforación", "Auxiliary Equipment": "Equipos auxiliares", "Cases & Projects": "Casos y proyectos"
  },
  ru: {
    "Products": "Продукция", "Applications": "Применение", "Factory": "Фабрика", "Cases": "Кейсы", "Certificates": "Сертификаты", "Blog": "Блог", "News": "Новости", "About": "О нас", "Contact": "Контакты", "FAQ": "FAQ", "Resources": "Ресурсы",
    "Get a Quote": "Запросить предложение", "Request a Quote": "Запросить предложение", "Submit Inquiry": "Отправить запрос", "Contact Sales": "Связаться с продажами", "View detail": "Подробнее", "View machine": "Смотреть машину", "Request details": "Запросить детали", "Send RFQ": "Отправить RFQ", "Request Catalog": "Запросить каталог",
    "Product Matrix": "Матрица продукции", "Product Categories": "Категории продукции", "High-Speed Slitting Machines": "Высокоскоростные машины резки", "Nonwoven Rewinding Machines": "Машины перемотки нетканых материалов", "Automatic Knife Systems": "Автоматические ножевые системы", "Perforating Production Lines": "Линии перфорации", "Auxiliary Equipment": "Вспомогательное оборудование", "Cases & Projects": "Кейсы и проекты"
  },
  ar: {
    "Products": "المنتجات", "Applications": "التطبيقات", "Factory": "المصنع", "Cases": "الحالات", "Certificates": "الشهادات", "Blog": "المدونة", "News": "الأخبار", "About": "من نحن", "Contact": "اتصل بنا", "FAQ": "الأسئلة الشائعة", "Resources": "الموارد",
    "Get a Quote": "اطلب عرض سعر", "Request a Quote": "اطلب عرض سعر", "Submit Inquiry": "إرسال الاستفسار", "Contact Sales": "تواصل مع المبيعات", "View detail": "عرض التفاصيل", "View machine": "عرض الآلة", "Request details": "طلب التفاصيل", "Send RFQ": "إرسال RFQ", "Request Catalog": "طلب الكتالوج",
    "Product Matrix": "مصفوفة المنتجات", "Product Categories": "فئات المنتجات", "High-Speed Slitting Machines": "آلات الشق عالية السرعة", "Nonwoven Rewinding Machines": "آلات إعادة لف غير المنسوجات", "Automatic Knife Systems": "أنظمة السكاكين الأوتوماتيكية", "Perforating Production Lines": "خطوط التثقيب", "Auxiliary Equipment": "المعدات المساعدة", "Cases & Projects": "الحالات والمشاريع"
  },
  fr: {
    "Products": "Produits", "Applications": "Applications", "Factory": "Usine", "Cases": "Cas", "Certificates": "Certificats", "Blog": "Blog", "News": "Actualités", "About": "À propos", "Contact": "Contact", "FAQ": "FAQ", "Resources": "Ressources",
    "Get a Quote": "Demander un devis", "Request a Quote": "Demander un devis", "Submit Inquiry": "Envoyer la demande", "Contact Sales": "Contacter les ventes", "View detail": "Voir le détail", "View machine": "Voir la machine", "Request details": "Demander des détails", "Send RFQ": "Envoyer RFQ", "Request Catalog": "Demander le catalogue",
    "Product Matrix": "Matrice produits", "Product Categories": "Catégories de produits", "High-Speed Slitting Machines": "Machines de refente haute vitesse", "Nonwoven Rewinding Machines": "Machines de rembobinage non-tissé", "Automatic Knife Systems": "Systèmes de couteaux automatiques", "Perforating Production Lines": "Lignes de perforation", "Auxiliary Equipment": "Équipements auxiliaires", "Cases & Projects": "Cas et projets"
  },
  pt: {
    "Products": "Produtos", "Applications": "Aplicações", "Factory": "Fábrica", "Cases": "Casos", "Certificates": "Certificados", "Blog": "Blog", "News": "Notícias", "About": "Sobre", "Contact": "Contato", "FAQ": "FAQ", "Resources": "Recursos",
    "Get a Quote": "Solicitar cotação", "Request a Quote": "Solicitar cotação", "Submit Inquiry": "Enviar consulta", "Contact Sales": "Falar com vendas", "View detail": "Ver detalhe", "View machine": "Ver máquina", "Request details": "Solicitar detalhes", "Send RFQ": "Enviar RFQ", "Request Catalog": "Solicitar catálogo",
    "Product Matrix": "Matriz de produtos", "Product Categories": "Categorias de produtos", "High-Speed Slitting Machines": "Máquinas de corte de alta velocidade", "Nonwoven Rewinding Machines": "Máquinas rebobinadeiras para não tecidos", "Automatic Knife Systems": "Sistemas de facas automáticas", "Perforating Production Lines": "Linhas de perfuração", "Auxiliary Equipment": "Equipamentos auxiliares", "Cases & Projects": "Casos e projetos"
  },
  zh: {
    "Products": "产品", "Applications": "应用", "Factory": "工厂", "Cases": "案例", "Certificates": "证书", "Blog": "博客", "News": "新闻", "About": "关于我们", "Contact": "联系", "FAQ": "常见问题", "Resources": "资源",
    "Get a Quote": "获取报价", "Request a Quote": "获取报价", "Submit Inquiry": "提交询盘", "Contact Sales": "联系销售", "View detail": "查看详情", "View machine": "查看设备", "Request details": "索取详情", "Send RFQ": "发送 RFQ", "Request Catalog": "索取目录",
    "Product Matrix": "产品矩阵", "Product Categories": "产品分类", "High-Speed Slitting Machines": "高速分切机", "Nonwoven Rewinding Machines": "无纺布复卷机", "Automatic Knife Systems": "自动排刀系统", "Perforating Production Lines": "打孔生产线", "Auxiliary Equipment": "辅助设备", "Cases & Projects": "案例与项目"
  }
};

const routeSpecificCopy = {
  "/products/high-speed-slitting-machines/": {
    es: {
      "Upgraded Model": "Modelo actualizado",
      "Lower noise, lower vibration and wider material compatibility.": "Menor ruido, menor vibración y mayor compatibilidad de materiales.",
      "The new high-speed slitting machine rendering shows the upgraded model. HDPTH has improved the drive system and base process design to support quieter, more stable operation for modern converting workshops.": "El nuevo render de la cortadora de alta velocidad muestra el modelo actualizado. HDPTH ha mejorado el sistema de accionamiento y el diseño del proceso base para ofrecer una operación más silenciosa y estable en talleres modernos de conversión.",
      "Upgraded drive system helps reduce running noise during high-speed production.": "El sistema de accionamiento actualizado ayuda a reducir el ruido durante la producción a alta velocidad.",
      "Upgraded base process design helps lower machine vibration and improve operating stability.": "El diseño actualizado del proceso base ayuda a reducir la vibración de la máquina y mejorar la estabilidad operativa.",
      "One slitting platform can process different material categories, helping buyers avoid purchasing separate machines for every material change.": "Una sola plataforma de corte puede procesar diferentes categorías de materiales, ayudando a evitar la compra de máquinas separadas para cada cambio de material.",
      "Applicable materials include spunbond, spunlace, needle-punched, wood pulp, meltblown, composite, flushable, hot-air nonwoven, film and paper.": "Los materiales aplicables incluyen spunbond, spunlace, punzonado, pulpa de madera, meltblown, compuestos, dispersables, no tejido de aire caliente, film y papel."
    },
    ru: {
      "Upgraded Model": "Обновленная модель",
      "Lower noise, lower vibration and wider material compatibility.": "Ниже шум, ниже вибрация и шире совместимость материалов.",
      "The new high-speed slitting machine rendering shows the upgraded model. HDPTH has improved the drive system and base process design to support quieter, more stable operation for modern converting workshops.": "Новый рендер высокоскоростной машины резки показывает обновленную модель. HDPTH улучшила приводную систему и базовую технологическую конструкцию для более тихой и стабильной работы в современных цехах переработки.",
      "Upgraded drive system helps reduce running noise during high-speed production.": "Обновленная приводная система помогает снизить рабочий шум при высокоскоростном производстве.",
      "Upgraded base process design helps lower machine vibration and improve operating stability.": "Обновленная базовая конструкция помогает снизить вибрацию машины и повысить стабильность работы.",
      "One slitting platform can process different material categories, helping buyers avoid purchasing separate machines for every material change.": "Одна платформа резки может обрабатывать разные категории материалов, помогая покупателям не приобретать отдельные машины под каждую смену материала.",
      "Applicable materials include spunbond, spunlace, needle-punched, wood pulp, meltblown, composite, flushable, hot-air nonwoven, film and paper.": "Подходящие материалы: spunbond, spunlace, иглопробивные, древесная целлюлоза, meltblown, композитные, смываемые, hot-air nonwoven, пленка и бумага."
    },
    ar: {
      "Upgraded Model": "الطراز المطور",
      "Lower noise, lower vibration and wider material compatibility.": "ضوضاء أقل واهتزاز أقل وتوافق أوسع مع المواد.",
      "The new high-speed slitting machine rendering shows the upgraded model. HDPTH has improved the drive system and base process design to support quieter, more stable operation for modern converting workshops.": "يوضح التصيير الجديد لآلة الشق عالية السرعة الطراز المطور. حسنت HDPTH نظام القيادة وتصميم العملية الأساسية لدعم تشغيل أكثر هدوءًا وثباتًا في ورش التحويل الحديثة.",
      "Upgraded drive system helps reduce running noise during high-speed production.": "يساعد نظام القيادة المطور على تقليل ضوضاء التشغيل أثناء الإنتاج عالي السرعة.",
      "Upgraded base process design helps lower machine vibration and improve operating stability.": "يساعد تصميم العملية الأساسية المطور على تقليل اهتزاز الآلة وتحسين ثبات التشغيل.",
      "One slitting platform can process different material categories, helping buyers avoid purchasing separate machines for every material change.": "يمكن لمنصة شق واحدة معالجة فئات مختلفة من المواد، مما يساعد المشترين على تجنب شراء آلات منفصلة لكل تغيير في المادة.",
      "Applicable materials include spunbond, spunlace, needle-punched, wood pulp, meltblown, composite, flushable, hot-air nonwoven, film and paper.": "تشمل المواد المناسبة spunbond وspunlace والمواد المثقوبة بالإبر ولب الخشب وmeltblown والمركبة والقابلة للتشتت والهواء الساخن والأفلام والورق."
    },
    fr: {
      "Upgraded Model": "Modèle mis à niveau",
      "Lower noise, lower vibration and wider material compatibility.": "Moins de bruit, moins de vibrations et une compatibilité matière plus large.",
      "The new high-speed slitting machine rendering shows the upgraded model. HDPTH has improved the drive system and base process design to support quieter, more stable operation for modern converting workshops.": "Le nouveau rendu de la machine de refente haute vitesse présente le modèle mis à niveau. HDPTH a amélioré le système d'entraînement et la conception du procédé de base pour offrir un fonctionnement plus silencieux et plus stable aux ateliers de conversion modernes.",
      "Upgraded drive system helps reduce running noise during high-speed production.": "Le système d'entraînement mis à niveau aide à réduire le bruit de fonctionnement en production haute vitesse.",
      "Upgraded base process design helps lower machine vibration and improve operating stability.": "La conception de base améliorée aide à réduire les vibrations de la machine et à renforcer la stabilité de fonctionnement.",
      "One slitting platform can process different material categories, helping buyers avoid purchasing separate machines for every material change.": "Une seule plateforme de refente peut traiter différentes catégories de matériaux, ce qui évite d'acheter une machine séparée à chaque changement de matériau.",
      "Applicable materials include spunbond, spunlace, needle-punched, wood pulp, meltblown, composite, flushable, hot-air nonwoven, film and paper.": "Les matériaux compatibles incluent spunbond, spunlace, aiguilleté, pâte de bois, meltblown, composite, dispersible, non-tissé à air chaud, film et papier."
    },
    pt: {
      "Upgraded Model": "Modelo atualizado",
      "Lower noise, lower vibration and wider material compatibility.": "Menor ruído, menor vibração e compatibilidade mais ampla de materiais.",
      "The new high-speed slitting machine rendering shows the upgraded model. HDPTH has improved the drive system and base process design to support quieter, more stable operation for modern converting workshops.": "A nova renderização da máquina de corte de alta velocidade mostra o modelo atualizado. A HDPTH melhorou o sistema de acionamento e o desenho do processo de base para uma operação mais silenciosa e estável em convertedoras modernas.",
      "Upgraded drive system helps reduce running noise during high-speed production.": "O sistema de acionamento atualizado ajuda a reduzir o ruído durante a produção em alta velocidade.",
      "Upgraded base process design helps lower machine vibration and improve operating stability.": "O processo de base atualizado ajuda a reduzir a vibração da máquina e melhorar a estabilidade operacional.",
      "One slitting platform can process different material categories, helping buyers avoid purchasing separate machines for every material change.": "Uma única plataforma de corte pode processar diferentes categorias de materiais, ajudando compradores a evitar máquinas separadas para cada troca de material.",
      "Applicable materials include spunbond, spunlace, needle-punched, wood pulp, meltblown, composite, flushable, hot-air nonwoven, film and paper.": "Os materiais aplicáveis incluem spunbond, spunlace, agulhado, polpa de madeira, meltblown, compostos, dispersíveis, não tecido hot-air, filme e papel."
    },
    zh: {
      "Upgraded Model": "升级机型",
      "Lower noise, lower vibration and wider material compatibility.": "降低噪声、降低振动，并兼容更多材料。",
      "The new high-speed slitting machine rendering shows the upgraded model. HDPTH has improved the drive system and base process design to support quieter, more stable operation for modern converting workshops.": "本次高速分切机新图展示的是升级后的机型。HDPTH 对驱动系统和基础工艺进行了升级，更适合现代后整理车间对低噪声、低振动和稳定运行的要求。",
      "Upgraded drive system helps reduce running noise during high-speed production.": "升级驱动系统，降低设备高速运行时的声噪。",
      "Upgraded base process design helps lower machine vibration and improve operating stability.": "升级基础工艺，降低设备运行振动量，提升运行稳定性。",
      "One slitting platform can process different material categories, helping buyers avoid purchasing separate machines for every material change.": "新型分切机可对不同种类材料进行分切，帮助客户减少因材料变化而重复采购新设备。",
      "Applicable materials include spunbond, spunlace, needle-punched, wood pulp, meltblown, composite, flushable, hot-air nonwoven, film and paper.": "适用材料包括纺粘、水刺、针刺、木浆、熔喷、复合、可冲散、热风无纺布、薄膜和纸张。"
    }
  }
};

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function routeToFile(route) {
  return route === "/" ? path.join(ROOT, "index.html") : path.join(ROOT, route.slice(1), "index.html");
}

function routePath(locale, route) {
  return route === "/" ? `/${locale}/` : `/${locale}${route}`;
}

function canonical(locale, route) {
  return `${BASE_URL}${routePath(locale, route)}`;
}

function hreflang(route) {
  const tags = localeCodes.map((code) => `<link rel="alternate" hreflang="${code}" href="${canonical(code, route)}">`);
  tags.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`);
  return tags.join("\n  ");
}

function relPrefix(route) {
  const segments = route === "/" ? [] : route.replace(/^\/|\/$/g, "").split("/");
  return "../".repeat(segments.length + 1);
}

function switcher(locale, route) {
  const label = locale.toUpperCase();
  const items = localeCodes
    .map((code) => {
      const active = code === locale ? " is-active" : "";
      return `<a class="language-option${active}" hreflang="${code}" href="${routePath(code, route)}"><span>${locales[code].native}</span><small>${code.toUpperCase()}</small></a>`;
    })
    .join("");
  return `<details class="language-switcher"><summary><span>${label}</span></summary><div class="language-menu">${items}</div></details>`;
}

function upsertHead(html, locale, route) {
  const page = meta[locale]?.[route] || meta.en[route] || meta.en["/"];
  html = html.replace(/<html[^>]*>/i, `<html lang="${locale}" dir="${locales[locale].dir}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${htmlEscape(page[0])}</title>`);
  if (/<meta name="description"[^>]*>/i.test(html)) {
    html = html.replace(/<meta name="description" content="[^"]*"[^>]*>/i, `<meta name="description" content="${htmlEscape(page[1])}">`);
  } else {
    html = html.replace(/<\/title>/i, `</title>\n  <meta name="description" content="${htmlEscape(page[1])}">`);
  }
  if (/<link rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/<link rel="canonical" href="[^"]*"[^>]*>/i, `<link rel="canonical" href="${canonical(locale, route)}">`);
  } else {
    html = html.replace(/<meta name="description"[^>]*>/i, `$&\n  <link rel="canonical" href="${canonical(locale, route)}">`);
  }
  html = html.replace(/\n\s*<link rel="alternate" hreflang="[^"]+" href="[^"]*">/g, "");
  html = html.replace(/<link rel="canonical" href="[^"]*"[^>]*>/i, `$&\n  ${hreflang(route)}`);
  return html;
}

function localizeAssets(html, route) {
  const prefix = relPrefix(route);
  html = html.replace(/((?:href|src|poster)=["'])(?:\.\.\/)*assets\//g, `$1${prefix}assets/`);
  html = html.replace(/(srcset=["'][^"']*)/g, (match) => match.replace(/(?:\.\.\/)*assets\//g, `${prefix}assets/`));
  html = html.replace(/((?:href)=["'])(?:\.\.\/)*styles\.css/g, `$1${prefix}styles.css`);
  html = html.replace(/((?:src)=["'])(?:\.\.\/)*scripts\.js/g, `$1${prefix}scripts.js`);
  html = html.replace(/((?:src)=["'])(?:\.\.\/)*social-links\.js/g, `$1${prefix}social-links.js`);
  html = html.replace(/((?:src)=["'])inquiry-form\.js/g, `$1${prefix}inquiry/inquiry-form.js`);
  return html;
}

function translateCommon(html, locale) {
  if (locale === "en") return html;
  const dict = common[locale] || {};
  for (const [from, to] of Object.entries(dict).sort((a, b) => b[0].length - a[0].length)) {
    html = html.replaceAll(from, to);
  }
  return html;
}

function translateRouteSpecific(html, locale, route) {
  if (locale === "en") return html;
  const dict = routeSpecificCopy[route]?.[locale] || {};
  for (const [from, to] of Object.entries(dict).sort((a, b) => b[0].length - a[0].length)) {
    html = html.replaceAll(from, to);
  }
  return html;
}

function updateH1AndAlt(html, locale, route) {
  const page = meta[locale]?.[route] || meta.en[route] || meta.en["/"];
  html = html.replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${htmlEscape(page[2])}</h1>`);
  const altPrefix = locale === "en" ? "" : `${page[2]} - `;
  html = html.replace(/alt="([^"]*(?:HDPTH|machine|Machine|machinery|Machinery|equipment|Equipment|project|Project)[^"]*)"/g, (_m, alt) => {
    if (locale === "en") return `alt="${htmlEscape(alt)}"`;
    if (alt.startsWith(page[2])) return `alt="${htmlEscape(alt)}"`;
    return `alt="${htmlEscape(`${altPrefix}${alt}`)}"`;
  });
  return html;
}

function insertSwitcher(html, locale, route) {
  html = html.replace(/<details class="language-switcher">[\s\S]*?<\/details>/g, "");
  const widget = switcher(locale, route);
  html = html.replace(/(<a class="btn btn-red" href="[^"]+">[^<]+<\/a><\/div><\/header>)/, `${widget}$1`);
  if (!html.includes("language-switcher")) {
    html = html.replace("</header>", `${widget}</header>`);
  }
  return html;
}

function localizePage(sourceHtml, locale, route) {
  let html = sourceHtml;
  html = upsertHead(html, locale, route);
  html = updateH1AndAlt(html, locale, route);
  html = translateCommon(html, locale);
  html = translateRouteSpecific(html, locale, route);
  html = localizeAssets(html, route);
  html = insertSwitcher(html, locale, route);
  return html;
}

async function writeMessages() {
  const dir = path.join(ROOT, "i18n", "messages");
  await mkdir(dir, { recursive: true });
  for (const locale of localeCodes) {
    const pages = {};
    for (const route of routes) {
      const page = meta[locale]?.[route] || meta.en[route] || meta.en["/"];
      pages[route] = {
        seoTitle: page[0],
        metaDescription: page[1],
        h1: page[2],
        imageAltPrefix: page[2]
      };
    }
    const payload = {
      locale,
      language: locales[locale],
      pages,
      common: common[locale] || {},
      apiProviderPlaceholder: {
        deeplApiKeyEnv: "DEEPL_API_KEY",
        googleCloudTranslationKeyEnv: "GOOGLE_CLOUD_TRANSLATION_API_KEY",
        note: "Reserved for regenerating SEO dictionaries through DeepL or Google Cloud Translation API. Do not use browser auto-translation as indexable page content."
      }
    };
    await writeFile(path.join(dir, `${locale}.json`), JSON.stringify(payload, null, 2), "utf8");
  }
}

async function buildLocales() {
  await writeMessages();
  for (const locale of localeCodes) {
    const targetDir = path.join(ROOT, locale);
    await rm(targetDir, { recursive: true, force: true });
    await mkdir(targetDir, { recursive: true });
    for (const route of routes) {
      const source = routeToFile(route);
      if (!existsSync(source)) continue;
      const html = readFileSync(source, "utf8");
      const localized = localizePage(html, locale, route);
      const out = route === "/" ? path.join(targetDir, "index.html") : path.join(targetDir, route.slice(1), "index.html");
      await mkdir(path.dirname(out), { recursive: true });
      writeFileSync(out, localized, "utf8");
    }
  }
}

async function updateRootEnglish() {
  for (const route of routes) {
    const file = routeToFile(route);
    if (!existsSync(file)) continue;
    let html = readFileSync(file, "utf8");
    html = upsertHead(html, "en", route);
    html = updateH1AndAlt(html, "en", route);
    html = insertSwitcher(html, "en", route);
    writeFileSync(file, html, "utf8");
  }
}

async function writeSitemap() {
  const urls = [];
  urls.push(`  <url><loc>${BASE_URL}/</loc></url>`);
  for (const route of routes) {
    for (const locale of localeCodes) {
      urls.push(`  <url><loc>${canonical(locale, route)}</loc></url>`);
    }
  }
  for (const route of extraSitemapRoutes) {
    urls.push(`  <url><loc>${BASE_URL}${route}</loc><lastmod>${extraSitemapLastmod[route] || "2026-07-13"}</lastmod></url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  await writeFile(path.join(ROOT, "sitemap.xml"), xml, "utf8");
}

await updateRootEnglish();
await buildLocales();
await writeSitemap();
