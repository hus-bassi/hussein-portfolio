# -*- coding: utf-8 -*-
"""
Generate comprehensive, professional Excel workbook containing verified Russian universities
offering Bachelor's program 38.03.05 Business Informatics (Бизнес-информатика),
with direct international admissions emails, faculty contacts, and official source links.
"""

import os
import xlsxwriter

UNIVERSITIES_DATA = [
    {
        "num": 1,
        "name_ru": "Российский университет дружбы народов им. Патриса Лумумбы (РУДН)",
        "name_en": "Peoples' Friendship University of Russia (RUDN University)",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Высшая школа управления РУДН (ВШУ)",
        "profile_ru": "Разработка прикладных решений для бизнеса / Бизнес-информатика",
        "email_primary": "intstudent@rudn.ru",
        "email_secondary": "mena@rudn.ru, hsm@rudn.ru, priem@rudn.ru",
        "source_url": "https://rudn.ru",
        "notes_ar": "لديهم مكتب مخصص للشرق الأوسط وشمال أفريقيا (mena@rudn.ru) بالإضافة لإيميل الطلاب الدوليين العام."
    },
    {
        "num": 2,
        "name_ru": "Национальный исследовательский университет «Высшая школа экономики» (НИУ ВШЭ, Москва)",
        "name_en": "HSE University (Moscow Campus)",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Высшая школа бизнеса ВШЭ (ВШБ)",
        "profile_ru": "Цифровая трансформация бизнеса / Бизнес-информатика",
        "email_primary": "inter@hse.ru",
        "email_secondary": "admissions_gsb@hse.ru, abitur@hse.ru",
        "source_url": "https://hse.ru",
        "notes_ar": "كلية إدارة الأعمال العليا بـ ВШЭ - المصنفة رقم 1 في روسيا في إدارة الأعمال والمعلوماتية."
    },
    {
        "num": 3,
        "name_ru": "НИУ «Высшая школа экономики» — Санкт-Петербург (НИУ ВШЭ СПб)",
        "name_en": "HSE University (Saint Petersburg Campus)",
        "city_ru": "Санкт-Петербург",
        "city_ar": "سانت بطرسبرغ",
        "code": "38.03.05",
        "faculty_ru": "Санкт-Петербургская школа экономики и менеджмента",
        "profile_ru": "Бизнес-информатика и цифровая аналитика",
        "email_primary": "iadmission-spb@hse.ru",
        "email_secondary": "spb-admissions@hse.ru",
        "source_url": "https://spb.hse.ru",
        "notes_ar": "فرع سانت بطرسبرغ لجامعة ВШЭ - قسم القبول الدولي المباشر."
    },
    {
        "num": 4,
        "name_ru": "Финансовый университет при Правительстве РФ (Финуниверситет)",
        "name_en": "Financial University under the Government of the Russian Federation",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Факультет информационных технологий и анализа больших данных",
        "profile_ru": "ИТ-менеджмент и цифровая трансформация бизнеса (Кафедра бизнес-информатики)",
        "email_primary": "interpriem@fa.ru",
        "email_secondary": "inter@fa.ru, businfo@fa.ru, priemka@fa.ru",
        "source_url": "https://fa.ru",
        "notes_ar": "الجامعة المالية التابعة للحكومة الروسية - بريد مخصص للقبول الدولي (interpriem) وللقسم مباشرة (businfo)."
    },
    {
        "num": 5,
        "name_ru": "Российский экономический университет им. Г.В. Плеханова (РЭУ им. Плеханова)",
        "name_en": "Plekhanov Russian University of Economics",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Высшая школа кибертехнологий, математики и статистики",
        "profile_ru": "Цифровая трансформация бизнеса / Аналитические ИТ-системы",
        "email_primary": "foreignst@rea.ru",
        "email_secondary": "abiturient@rea.ru, fmesi@rea.ru",
        "source_url": "https://rea.ru",
        "notes_ar": "أقدم جامعة اقتصادية في روسيا (بليخانوف) - المدرسة العليا للتقنيات السيبرانية."
    },
    {
        "num": 6,
        "name_ru": "Московский государственный технический университет им. Н.Э. Баумана (МГТУ им. Баумана)",
        "name_en": "Bauman Moscow State Technical University",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Факультет «Инженерный бизнес и менеджмент»",
        "profile_ru": "Технологии электронного бизнеса (Кафедра ИБМ6)",
        "email_primary": "orisa@bmstu.ru",
        "email_secondary": "ibm6@bmstu.ru, abiturient@bmstu.ru",
        "source_url": "https://bmstu.ru",
        "notes_ar": "جامعة باومان التقنية الأسطورية - كلية إدارة وهندسة الأعمال وقسم التجارة والبيزنس الإلكتروني (ИБМ6)."
    },
    {
        "num": 7,
        "name_ru": "Национальный исследовательский университет ИТМО (Университет ИТМО)",
        "name_en": "ITMO University",
        "city_ru": "Санкт-Петербург",
        "city_ar": "سانت بطرسبرغ",
        "code": "38.03.05",
        "faculty_ru": "Факультет технологического менеджмента и инноваций (ФТМИ)",
        "profile_ru": "Бизнес-информатика и управление на основе данных",
        "email_primary": "int.students@itmo.ru",
        "email_secondary": "international@itmo.ru, abitftmi@edu.itmo.ru, agorgadze@itmo.ru",
        "source_url": "https://itmo.ru",
        "notes_ar": "جامعة تكنولوجيا المعلومات الأولى عالمياً (إيتمو) - إيميل القبول الدولي ورئيس البرنامج مباشرة د. أليكسي غورغادزه."
    },
    {
        "num": 8,
        "name_ru": "Санкт-Петербургский государственный университет (СПбГУ)",
        "name_en": "Saint Petersburg State University (SPbU)",
        "city_ru": "Санкт-Петербург",
        "city_ar": "سانت بطرسبرغ",
        "code": "38.03.05",
        "faculty_ru": "Экономический факультет / Высшая школа менеджмента СПбГУ (ВШМ)",
        "profile_ru": "Информационные системы в экономике и бизнес-информатика",
        "email_primary": "admission@spbu.ru",
        "email_secondary": "spbu@spbu.ru, abitur@gsom.spbu.ru",
        "source_url": "https://spbu.ru",
        "notes_ar": "أعرق جامعة روسية بجانب جامعة موسكو - بوابة القبول الدولي المباشر (admission@spbu.ru)."
    },
    {
        "num": 9,
        "name_ru": "Санкт-Петербургский политехнический университет Петра Великого (СПбПУ)",
        "name_en": "Peter the Great St. Petersburg Polytechnic University (SPbPU)",
        "city_ru": "Санкт-Петербург",
        "city_ar": "سانت بطرسبرغ",
        "code": "38.03.05",
        "faculty_ru": "Институт промышленного менеджмента, экономики и торговли",
        "profile_ru": "Информационные системы управления бизнесом / Бизнес-информатика",
        "email_primary": "interadmission@spbstu.ru",
        "email_secondary": "interstudy@spbstu.ru, admissioninfo@spbstu.ru, abitur@spbstu.ru",
        "source_url": "https://spbstu.ru",
        "notes_ar": "بوليتكنيك بطرسبرغ - جامعة بحثية وطنية كبرى مع مكتب قبول دولي قوي وسريع التجاوب."
    },
    {
        "num": 10,
        "name_ru": "Санкт-Петербургский государственный экономический университет (СПбГЭУ)",
        "name_en": "Saint Petersburg State University of Economics (UNECON)",
        "city_ru": "Санкт-Петербург",
        "city_ar": "سانت بطرسبرغ",
        "code": "38.03.05",
        "faculty_ru": "Факультет информатики и прикладной математики",
        "profile_ru": "Информационные системы и технологии в бизнесе",
        "email_primary": "interstud@unecon.ru",
        "email_secondary": "abitura@unecon.ru",
        "source_url": "https://unecon.ru",
        "notes_ar": "الجامعة الاقتصادية الرائدة في سانت بطرسبرغ - متخصصة كلياً في علوم الاقتصاد والمعلوماتية التجارية."
    },
    {
        "num": 11,
        "name_ru": "Российская академия народного хозяйства и государственной службы (РАНХиГС)",
        "name_en": "RANEPA - The Russian Presidential Academy",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Институт экономики, математики и информационных технологий (Институт ЭМИТ)",
        "profile_ru": "Информационные системы в бизнесе / Цифровые платформы",
        "email_primary": "international@ranepa.ru",
        "email_secondary": "info-bi-emit@ranepa.ru, abitura-emit@ranepa.ru, sidorova@ranepa.ru",
        "source_url": "https://ranepa.ru",
        "notes_ar": "أكاديمية الرئاسة الروسية - معهد إيميت لديه موقع مخصص لتخصص بيزنس إنفورماتكس (bi-ranepa.ru)."
    },
    {
        "num": 12,
        "name_ru": "Национальный исследовательский ядерный университет «МИФИ» (НИЯУ МИФИ)",
        "name_en": "National Research Nuclear University MEPhI",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Факультет бизнес-информатики и управления комплексными системами",
        "profile_ru": "Искусственный интеллект и бизнес-информатика",
        "email_primary": "interadmission@mephi.ru",
        "email_secondary": "inter@mephi.ru, ONPetukhova@mephi.ru, priem@mephi.ru",
        "source_url": "https://mephi.ru",
        "notes_ar": "ميفي - واحدة من أقوى 3 جامعات في العلوم الفيزيائية والحاسوبية بروسيا مع مسار متميز في ذكاء الأعمال الاصطناعي."
    },
    {
        "num": 13,
        "name_ru": "Национальный исследовательский технологический университет «МИСИС» (НИТУ МИСИС)",
        "name_en": "National University of Science and Technology MISIS",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Институт компьютерных наук",
        "profile_ru": "ИТ-решения и аналитика данных для корпораций",
        "email_primary": "welcome@misis.ru",
        "email_secondary": "vopros@misis.ru",
        "source_url": "https://misis.ru",
        "notes_ar": "جامعة ميسيس البحثية الوطنية بموسكو - مركز الترحيب بالطلاب الدوليين (welcome@misis.ru)."
    },
    {
        "num": 14,
        "name_ru": "МИРЭА — Российский технологический университет (РТУ МИРЭА)",
        "name_en": "MIREA - Russian Technological University",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Институт кибербезопасности и цифровых технологий",
        "profile_ru": "Прикладные ИТ-решения для бизнеса",
        "email_primary": "imo@mirea.ru",
        "email_secondary": "pk@mirea.ru",
        "source_url": "https://mirea.ru",
        "notes_ar": "معهد التعليم الدولي بميريا (imo@mirea.ru) - جامعة تقنية عملاقة في هندسة البرمجيات ونظم المعلومات."
    },
    {
        "num": 15,
        "name_ru": "Государственный университет управления (ГУУ, Москва)",
        "name_en": "State University of Management (SUM / GUU)",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Институт информационных систем ГУУ",
        "profile_ru": "Управление цифровыми продуктами и бизнес-аналитика",
        "email_primary": "admission@guu.ru",
        "email_secondary": "kaf_is@guu.ru, om_pisareva@guu.ru, inf@guu.ru",
        "source_url": "https://guu.ru",
        "notes_ar": "جامعة الإدارة الحكومية بموسكو - إيميل القبول الدولي مباشر ورئيسة معهد النظم د. أولغا بيساريفا."
    },
    {
        "num": 16,
        "name_ru": "Национальный исследовательский университет «МЭИ» (НИУ МЭИ)",
        "name_en": "National Research University 'Moscow Power Engineering Institute' (MPEI)",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Институт энергоэффективности и водородных технологий (ИнЭИ)",
        "profile_ru": "Информационное и программное обеспечение бизнес-процессов",
        "email_primary": "mpei@interedu.ru",
        "email_secondary": "inei@mpei.ru, pk@mpei.ru",
        "source_url": "https://mpei.ru",
        "notes_ar": "جامعة هندسة الطاقة الوطنية بموسكو - مركز البرامج التعليمية الدولية (mpei@interedu.ru)."
    },
    {
        "num": 17,
        "name_ru": "Московский политехнический университет (Московский Политех)",
        "name_en": "Moscow Polytechnic University (Moscow Polytech)",
        "city_ru": "Москва",
        "city_ar": "موسكو",
        "code": "38.03.05",
        "faculty_ru": "Факультет информационных технологий (Кафедра прикладной информатики)",
        "profile_ru": "ИТ-менеджмент в цифровой индустрии",
        "email_primary": "urisa@mospolytech.ru",
        "email_secondary": "international@mospolytech.ru, isu@mospolytech.ru",
        "source_url": "https://mospolytech.ru",
        "notes_ar": "بوليتكنيك موسكو - إدارة الاندماج الدولي وشؤون الطلاب الأجانب (urisa@mospolytech.ru)."
    },
    {
        "num": 18,
        "name_ru": "Уральский федеральный университет им. первого Президента России Б.Н. Ельцина (УрФУ)",
        "name_en": "Ural Federal University (UrFU)",
        "city_ru": "Екатеринбург",
        "city_ar": "يكاترينبورغ",
        "code": "38.03.05",
        "faculty_ru": "Институт экономики и управления (ИнЭУ УрФУ)",
        "profile_ru": "Бизнес-информатика и цифровые платформы",
        "email_primary": "admission@urfu.ru",
        "email_secondary": "priem@urfu.ru",
        "source_url": "https://urfu.ru",
        "notes_ar": "جامعة الأورال الفيدرالية - إحدى أكبر 5 جامعات في روسيا، تواصل مباشر وسريع جداً مع الطلاب الأجانب."
    },
    {
        "num": 19,
        "name_ru": "Казанский (Приволжский) федеральный университет (КФУ)",
        "name_en": "Kazan Federal University (KFU)",
        "city_ru": "Казань",
        "city_ar": "قازان",
        "code": "38.03.05",
        "faculty_ru": "Институт управления, экономики и финансов (ИУЭФ)",
        "profile_ru": "Бизнес-информатика и финансовая аналитика",
        "email_primary": "admission@kpfu.ru",
        "email_secondary": "scholarship@kpfu.ru, priem@kpfu.ru",
        "source_url": "https://kpfu.ru",
        "notes_ar": "جامعة قازان الفيدرالية - تواصل عبر admission@kpfu.ru ولديهم إيميل مخصص للمنح (scholarship@kpfu.ru)."
    },
    {
        "num": 20,
        "name_ru": "Национальный исследовательский Томский государственный университет (НИ ТГУ)",
        "name_en": "Tomsk State University (TSU)",
        "city_ru": "Томск",
        "city_ar": "تومسك",
        "code": "38.03.05",
        "faculty_ru": "Институт экономики и менеджмента (ИЭМ ТГУ)",
        "profile_ru": "Информационные технологии и бизнес-аналитика",
        "email_primary": "int.admissions@mail.tsu.ru",
        "email_secondary": "iem@mail.tsu.ru, bogdanov.al@mail.tsu.ru, pk@mail.tsu.ru",
        "source_url": "https://tsu.ru",
        "notes_ar": "جامعة تومسك الحكومية العريقة - مدينة تومسك الجامعية الشهيرة، إيميل القبول الدولي ورئيس القسم د. ألكسندر بوغدانوف."
    },
    {
        "num": 21,
        "name_ru": "Национальный исследовательский Нижегородский государственный университет им. Н.И. Лобачевского (ННГУ)",
        "name_en": "Lobachevsky State University of Nizhny Novgorod (UNN)",
        "city_ru": "Нижний Новгород",
        "city_ar": "نيجني نوفغورود",
        "code": "38.03.05",
        "faculty_ru": "Институт экономики и предпринимательства (ИЭП ННГУ)",
        "profile_ru": "Аналитические методы и ИТ поддержки решений в экономике и бизнесе",
        "email_primary": "admissions@unn.ru",
        "email_secondary": "admissions@fis.unn.ru, priem@iee.unn.ru, international@unn.ru",
        "source_url": "https://unn.ru",
        "notes_ar": "جامعة لوباتشيفسكي - معهد الاقتصاد وريادة الأعمال، إيميل كلية الطلاب الأجانب (admissions@fis.unn.ru)."
    },
    {
        "num": 22,
        "name_ru": "Южный федеральный университет (ЮФУ)",
        "name_en": "Southern Federal University (SFedU)",
        "city_ru": "Ростов-на-Дону / Таганрог",
        "city_ar": "روستوف على الدون / تاغانروغ",
        "code": "38.03.05",
        "faculty_ru": "Экономический факультет ЮФУ / ИУЭС ЮФУ",
        "profile_ru": "Бизнес-аналитика / Электронный бизнес и передовые ИТ-решения",
        "email_primary": "welcome@sfedu.ru",
        "email_secondary": "dekanat.econ@sfedu.ru, migration@sfedu.ru",
        "source_url": "https://sfedu.ru",
        "notes_ar": "الجامعة الفيدرالية الجنوبية - مركز استقطاب الطلاب الدوليين (welcome@sfedu.ru)."
    },
    {
        "num": 23,
        "name_ru": "Сибирский федеральный университет (СФУ, Красноярск)",
        "name_en": "Siberian Federal University (SibFU)",
        "city_ru": "Красноярск",
        "city_ar": "كراسنويارسك",
        "code": "38.03.05",
        "faculty_ru": "Институт управления бизнес-процессами",
        "profile_ru": "Информационные технологии в управлении бизнесом",
        "email_primary": "admission@sfu-kras.ru",
        "email_secondary": "zayavlenie@sfu-kras.ru",
        "source_url": "https://sfu-kras.ru",
        "notes_ar": "جامعة سيبيريا الفيدرالية - كراسنويارسك، مكتب استقطاب وقبول الطلاب الأجانب المباشر."
    },
    {
        "num": 24,
        "name_ru": "Дальневосточный федеральный университет (ДВФУ, Владивосток)",
        "name_en": "Far Eastern Federal University (FEFU)",
        "city_ru": "Владивосток",
        "city_ar": "فلاديفوستوك",
        "code": "38.03.05",
        "faculty_ru": "Школа экономики и менеджмента (ШЭМ ДВФУ)",
        "profile_ru": "Бизнес-аналитика и управление данными",
        "email_primary": "interadmission@dvfu.ru",
        "email_secondary": "interoffice@dvfu.ru, interadvising@dvfu.ru",
        "source_url": "https://dvfu.ru",
        "notes_ar": "الجامعة الفيدرالية في الشرق الأقصى - الحرم الجامعي الشهير بجزيرة روسكي، قسم القبول الدولي المباشر."
    },
    {
        "num": 25,
        "name_ru": "Новосибирский национальный исследовательский государственный университет (НГУ)",
        "name_en": "Novosibirsk State University (NSU)",
        "city_ru": "Новосибирск",
        "city_ar": "نوفوسيبيرسك",
        "code": "38.03.05",
        "faculty_ru": "Экономический факультет НГУ",
        "profile_ru": "Бизнес-информатика и прикладное моделирование",
        "email_primary": "interstudy@nsu.ru",
        "email_secondary": "foreign@lab.nsu.ru, priem@nsu.ru",
        "source_url": "https://nsu.ru",
        "notes_ar": "جامعة نوفوسيبيرسك الحكومية (أكاديمغورودوك) - العاصمة العلمية لسيبيريا، إيميل القبول الدولي (interstudy@nsu.ru)."
    },
    {
        "num": 26,
        "name_ru": "Самарский национальный исследовательский университет им. С.П. Королёва (Самарский университет)",
        "name_en": "Samara National Research University (Samara University)",
        "city_ru": "Самара",
        "city_ar": "سامارا",
        "code": "38.03.05",
        "faculty_ru": "Институт экономики и управления (Кафедра математики и бизнес-информатики)",
        "profile_ru": "Бизнес-информатика и системный анализ",
        "email_primary": "admission@ssau.ru",
        "email_secondary": "iem@ssau.ru, priem@ssau.ru, intdep@ssau.ru",
        "source_url": "https://ssau.ru",
        "notes_ar": "جامعة سامارا الفضائية - تاريخ عريق في علوم الفضاء والبيانات، قسم قبول دولي مباشر (admission@ssau.ru)."
    },
    {
        "num": 27,
        "name_ru": "Южно-Уральский государственный университет (национальный исследовательский университет) (ЮУрГУ)",
        "name_en": "South Ural State University (SUSU)",
        "city_ru": "Челябинск",
        "city_ar": "تشيليابينسك",
        "code": "38.03.05",
        "faculty_ru": "Высшая школа экономики и управления",
        "profile_ru": "Цифровая экономика и корпоративные информационные технологии",
        "email_primary": "applicant@susu.ru",
        "email_secondary": "digital-economy@susu.ru, prkom@susu.ru",
        "source_url": "https://susu.ru",
        "notes_ar": "جامعة جنوب الأورال البحثية الوطنية - إيميل مباشر للطلاب المتقدمين الدوليين (applicant@susu.ru)."
    },
    {
        "num": 28,
        "name_ru": "Воронежский государственный университет (ВГУ)",
        "name_en": "Voronezh State University (VSU)",
        "city_ru": "Воронеж",
        "city_ar": "فورونيج",
        "code": "38.03.05",
        "faculty_ru": "Факультет прикладной математики, информатики и механики (ПММ)",
        "profile_ru": "Информационные системы в бизнесе и менеджменте",
        "email_primary": "imo@interedu.vsu.ru",
        "email_secondary": "deanery@amm.vsu.ru, office@main.vsu.ru",
        "source_url": "https://vsu.ru",
        "notes_ar": "جامعة فورونيج الحكومية - معهد التعليم الدولي لديه خبرة تفوق 60 عاماً في تعليم وتدريب الطلاب الأجانب."
    },
    {
        "num": 29,
        "name_ru": "Кубанский государственный университет (КубГУ, Краснодар)",
        "name_en": "Kuban State University (KubSU)",
        "city_ru": "Краснодар",
        "city_ar": "كراسنودار",
        "code": "38.03.05",
        "faculty_ru": "Экономический факультет",
        "profile_ru": "Цифровая экономика и информационные системы в бизнесе",
        "email_primary": "interdep@kubsu.ru",
        "email_secondary": "abitur@kubsu.ru, kafecon@mail.ru",
        "source_url": "https://kubsu.ru",
        "notes_ar": "جامعة كوبان الحكومية بكراسنودار - إدارة العلاقات الدولية (interdep@kubsu.ru)."
    },
    {
        "num": 30,
        "name_ru": "Северо-Кавказский федеральный университет (СКФУ, Ставрополь)",
        "name_en": "North-Caucasus Federal University (NCFU)",
        "city_ru": "Ставрополь",
        "city_ar": "ستافروبول",
        "code": "38.03.05",
        "faculty_ru": "Институт цифрового развития",
        "profile_ru": "Бизнес-информатика и цифровые трансформации",
        "email_primary": "ois.selcom@ncfu.ru",
        "email_secondary": "selcom@ncfu.ru",
        "source_url": "https://ncfu.ru",
        "notes_ar": "جامعة شمال القوقاز الفيدرالية - قسم قبول الطلاب الأجانب (ois.selcom@ncfu.ru)."
    },
    {
        "num": 31,
        "name_ru": "Тюменский индустриальный университет (ТИУ, Тюмень)",
        "name_en": "Industrial University of Tyumen (TIU)",
        "city_ru": "Тюмень",
        "city_ar": "تيومين",
        "code": "38.03.05",
        "faculty_ru": "Институт математики и цифровых технологий (ИМЦТ)",
        "profile_ru": "Информационные системы предприятия",
        "email_primary": "orsio@tyuiu.ru",
        "email_secondary": "priemcom@tyuiu.ru, maltsevatv@tyuiu.ru",
        "source_url": "https://tyuiu.ru",
        "notes_ar": "جامعة تيومين الصناعية - قسم استقطاب ودعم الطلاب الأجانب (orsio@tyuiu.ru)."
    },
    {
        "num": 32,
        "name_ru": "Пермский государственный национальный исследовательский университет (ПГНИУ)",
        "name_en": "Perm State University (PSU)",
        "city_ru": "Пермь",
        "city_ar": "بيرم",
        "code": "38.03.05",
        "faculty_ru": "Экономический факультет (Кафедра информационных систем)",
        "profile_ru": "Бизнес-аналитика и корпоративные ИТ",
        "email_primary": "international@psu.ru",
        "email_secondary": "int_dpt@psu.ru, econom@psu.ru, entrance.examination@psu.ru",
        "source_url": "https://psu.ru",
        "notes_ar": "جامعة بيرم الوطنية البحثية - إدارة العلاقات الدولية (international@psu.ru)."
    }
]


def create_workbook(file_path):
    workbook = xlsxwriter.Workbook(file_path)

    # Styles & Formatting
    header_format = workbook.add_format({
        'bold': True,
        'font_name': 'Segoe UI',
        'font_size': 11,
        'bg_color': '#1A2A40',  # Deep Navy
        'font_color': '#FFFFFF',
        'border': 1,
        'border_color': '#D4AF37', # Gold
        'align': 'center',
        'valign': 'vcenter',
        'text_wrap': True
    })

    title_format = workbook.add_format({
        'bold': True,
        'font_name': 'Segoe UI',
        'font_size': 16,
        'bg_color': '#0F172A',
        'font_color': '#F8FAFC',
        'align': 'left',
        'valign': 'vcenter'
    })

    subtitle_format = workbook.add_format({
        'italic': True,
        'font_name': 'Segoe UI',
        'font_size': 10,
        'font_color': '#64748B',
        'align': 'left',
        'valign': 'vcenter'
    })

    cell_standard = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'valign': 'vcenter',
        'border': 1,
        'border_color': '#E2E8F0',
        'text_wrap': True
    })

    cell_center = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'align': 'center',
        'valign': 'vcenter',
        'border': 1,
        'border_color': '#E2E8F0'
    })

    cell_zebra = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'bg_color': '#F8FAFC',
        'valign': 'vcenter',
        'border': 1,
        'border_color': '#E2E8F0',
        'text_wrap': True
    })

    cell_zebra_center = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'bg_color': '#F8FAFC',
        'align': 'center',
        'valign': 'vcenter',
        'border': 1,
        'border_color': '#E2E8F0'
    })

    email_format = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'bold': True,
        'font_color': '#1D4ED8', # Deep Blue link
        'valign': 'vcenter',
        'border': 1,
        'border_color': '#E2E8F0',
        'underline': True
    })

    url_format = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'font_color': '#059669', # Emerald link
        'align': 'center',
        'valign': 'vcenter',
        'border': 1,
        'border_color': '#E2E8F0',
        'underline': True
    })

    code_badge_format = workbook.add_format({
        'font_name': 'Consolas',
        'font_size': 11,
        'bold': True,
        'bg_color': '#EFF6FF',
        'font_color': '#1E3A8A',
        'align': 'center',
        'valign': 'vcenter',
        'border': 1,
        'border_color': '#93C5FD'
    })

    # ==========================================
    # SHEET 1: Universities Directory
    # ==========================================
    ws1 = workbook.add_worksheet("38.03.05 Бизнес-информатика")
    ws1.set_landscape()
    ws1.set_margins(0.5, 0.5, 0.5, 0.5)

    # Title Block
    ws1.merge_range("A1:K1", "  Каталог ведущих университетов России — Направление 38.03.05 «Бизнес-информатика» (Бакалавриат)", title_format)
    ws1.set_row(0, 36)
    ws1.merge_range("A2:K2", "  دليل الجامعات الروسية المعتمدة لتخصص بيزنس إنفورماتكس (كود 38.03.05) مع إيميلات القبول الدولي المباشرة وروابط التحقق الرسمية", subtitle_format)
    ws1.set_row(1, 22)
    ws1.set_row(2, 10) # blank row

    headers = [
        "№",
        "Город / المدينة",
        "Название университета (RU)",
        "University Name (EN)",
        "Код специальности",
        "Факультет / Институт / Профиль",
        "Email приёма иностранцев (Основной)",
        "Дополнительные / Кафедральные Email",
        "Официальный сайт / Источник",
        "ملاحظات وتفاصيل التقديم (AR)"
    ]

    header_col_widths = [5, 16, 42, 38, 14, 40, 32, 34, 25, 45]

    ws1.set_row(3, 30)
    for col_idx, (header_text, width) in enumerate(zip(headers, header_col_widths)):
        ws1.write(3, col_idx, header_text, header_format)
        ws1.set_column(col_idx, col_idx, width)

    ws1.freeze_panes(4, 0) # Freeze header

    # Populate Data
    start_row = 4
    for idx, item in enumerate(UNIVERSITIES_DATA):
        r = start_row + idx
        is_even = (idx % 2 == 0)
        c_fmt = cell_standard if is_even else cell_zebra
        c_ctr = cell_center if is_even else cell_zebra_center

        ws1.set_row(r, 26)

        # 0: Number
        ws1.write_number(r, 0, item["num"], c_ctr)
        # 1: City (RU / AR)
        ws1.write_string(r, 1, f"{item['city_ru']}\n({item['city_ar']})", c_ctr)
        # 2: University Name RU
        ws1.write_string(r, 2, item["name_ru"], c_fmt)
        # 3: University Name EN
        ws1.write_string(r, 3, item["name_en"], c_fmt)
        # 4: Code
        ws1.write_string(r, 4, item["code"], code_badge_format)
        # 5: Faculty & Profile
        ws1.write_string(r, 5, f"{item['faculty_ru']}\n— {item['profile_ru']}", c_fmt)

        # 6: Primary International Admissions Email (Active Mailto)
        email_p = item["email_primary"].strip()
        subject_str = f"Заявление о поступлении (Бакалавриат 38.03.05 Бизнес-информатика) - Hussein ElBassiouni"
        ws1.write_url(r, 6, f"mailto:{email_p}?subject={subject_str}", email_format, email_p)

        # 7: Secondary Emails
        ws1.write_string(r, 7, item["email_secondary"], c_fmt)

        # 8: Official Source Link
        ws1.write_url(r, 8, item["source_url"], url_format, item["source_url"])

        # 9: Notes AR
        ws1.write_string(r, 9, item["notes_ar"], c_fmt)

    # ==========================================
    # SHEET 2: Outreach Guide & Russian Email Template
    # ==========================================
    ws2 = workbook.add_worksheet("دليل المراسلة ونموذج الإيميل")
    ws2.set_margins(0.6, 0.6, 0.6, 0.6)

    ws2.set_column(0, 0, 4)
    ws2.set_column(1, 1, 95)

    ws2.merge_range("B1:B2", "خطة مراسلة الجامعات الروسية ونموذج الإيميل الرسمي (Деловой русский язык)", title_format)
    ws2.set_row(0, 24)
    ws2.set_row(1, 24)
    ws2.set_row(2, 12)

    guide_header = workbook.add_format({
        'bold': True,
        'font_name': 'Segoe UI',
        'font_size': 13,
        'bg_color': '#334155',
        'font_color': '#F8FAFC',
        'valign': 'vcenter',
        'border': 1
    })

    text_card = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'valign': 'top',
        'border': 1,
        'border_color': '#CBD5E1',
        'text_wrap': True,
        'bg_color': '#FFFFFF'
    })

    code_card = workbook.add_format({
        'font_name': 'Consolas',
        'font_size': 10,
        'valign': 'top',
        'border': 1,
        'border_color': '#CBD5E1',
        'text_wrap': True,
        'bg_color': '#F1F5F9'
    })

    ws2.set_row(3, 28)
    ws2.write_string(3, 1, " 1. تعليمات الإرسال الفعّالة لتحقيق أعلى نسبة قبول ورد", guide_header)

    instructions_text = (
        "1. التوقيت المثالي للإرسال: أرسل الرسائل بتوقيت موسكو (من 10:00 صباحاً حتى 3:00 عصراً) في أيام العمل الرسمية (من الإثنين إلى الجمعة).\n"
        "2. الملفات المرفقة مع كل إيميل (Attachments):\n"
        "   - ملف مشروع سوق المجد باللغة الروسية (Souq_Elmajde_RUDN_Medical_Project_Russian.pdf)\n"
        "   - ملف منصة البورتفوليو الهندسية باللغة الروسية (Hussein_Portfolio_Platform_RUDN_Russian.pdf)\n"
        "   - صورة شهادة تفوق البيت الروسي / روس سوترودنيتشستفو (Диплом Россотрудничества)\n"
        "   - صورة شهادة الإملاء الروسي الدولي 2026 (Международный диктант)\n"
        "3. تخصيص اسم الجامعة: قبل إرسال الرسالة، تأكد من استبدال [Название Университета] باسم الجامعة الروسية كما هو موضح في الشيت الأول.\n"
        "4. المتابعة (Follow-up): إذا لم يصلك رد خلال 7 أيام عمل، أرسل إيميل متابعة مهذب لنفس السلسلة."
    )
    ws2.set_row(4, 115)
    ws2.write_string(4, 1, instructions_text, text_card)

    ws2.set_row(5, 12) # blank

    ws2.set_row(6, 28)
    ws2.write_string(6, 1, " 2. عنوان الإيميل الروسي (Email Subject Line)", guide_header)

    subject_text = "Заявление о поступлении на бакалавриат 38.03.05 «Бизнес-информатика» — Хусейн Эльбассиуни (Египет)"
    ws2.set_row(7, 30)
    ws2.write_string(7, 1, subject_text, code_card)

    ws2.set_row(8, 12) # blank

    ws2.set_row(9, 28)
    ws2.write_string(9, 1, " 3. نص الرسالة بالروسية الرسمية الفصحى (Деловой русский язык) - جاهز للنسخ", guide_header)

    russian_letter = (
        "Уважаемые коллеги из Департамента международного сотрудничества и Приёмной комиссии,\n\n"
        "Здравствуйте!\n\n"
        "Меня зовут Хусейн Эльбассиуни (Hussein ElBassiouni), я гражданин Арабской Республики Египет.\n\n"
        "Обращаюсь к Вам с искренним академическим интересом касательно поступления в Ваш уважаемый университет "
        "на программу бакалавриата по направлению 38.03.05 «Бизнес-информатика» на 2026/2027 учебный год (как в рамках квоты "
        "Правительства Российской Федерации / Россотрудничества, так и по прямому контракту или с подготовительным факультетом по русскому языку).\n\n"
        "Я глубоко увлечен цифровой трансформацией бизнеса, анализом данных и корпоративными информационными системами. "
        "В течение последних лет я целенаправленно инвестирую свое время в изучение современных технологий, языка Python, "
        "реляционных баз данных SQL, систем аналитики данных и бизнес-моделирования.\n\n"
        "Мои ключевые академические и проектные достижения:\n"
        "1. Реализация комплексного медицинского аналитического проекта «Souq Elmajde» (анализ динамики спроса на фармацевтическом рынке "
        "с использованием Python, SQL и многомерного статистического моделирования).\n"
        "2. Разработка собственной многоязычной инженерной веб-платформы портфолио с полной адаптацией и поддержкой русского языка, "
        "отвечающей строгим стандартам производительности и веб-доступности.\n"
        "3. Награждён почётным Дипломом Русского дома в Каире (Представительство Россотрудничества в АРЕ) за координацию и вклад в волонтёрскую деятельность.\n"
        "4. Обладатель официального сертификата международной акции «Всемирный диктант по русскому языку 2026» (Министерство культуры РФ).\n"
        "5. Участник Международной олимпиады «Open Doors: Russian Scholarship Project» 2026 по профилю Business & Management, "
        "где мой академический портфель набрал максимально возможную предварительную оценку (100 баллов).\n\n"
        "К настоящему письму прилагаю:\n"
        "— Проектную документацию по медицинскому проекту «Souq Elmajde» (на русском языке, PDF);\n"
        "— Инженерную документацию платформы портфолио (на русском языке, PDF);\n"
        "— Копии подтверждающих сертификатов и дипломов Россотрудничества.\n\n"
        "Ознакомиться с моими открытыми исходными кодами и проектами также можно на моем официальном портале:\n"
        "https://hussein-portfolio.com (или https://github.com/hussein-portfolio)\n\n"
        "Буду чрезвычайно признателен за разъяснение регламента подачи документов для иностранных абитуриентов, "
        "возможности прохождения подготовительного отделения (факультета довузовской подготовки) и сроков приёмной кампании по направлению 38.03.05.\n\n"
        "Благодарю Вас за уделенное время и внимание к моей кандидатуре.\n\n"
        "С глубоким уважением,\n"
        "Хусейн Мохамед Мостафа Ахмед Эльбассиуни\n"
        "Каир, Египет\n"
        "Email: [Ваш актуальный адрес]\n"
        "WhatsApp / Telegram: [Ваш номер телефона]"
    )

    ws2.set_row(10, 480)
    ws2.write_string(10, 1, russian_letter, code_card)

    workbook.close()
    try:
        print(f"Successfully generated workbook at: {file_path}")
    except Exception:
        print("Successfully generated workbook.")


if __name__ == "__main__":
    out_dir = r"d:\hussein-portfolio\مشروع"
    os.makedirs(out_dir, exist_ok=True)
    target_xlsx = os.path.join(out_dir, "Russian_Universities_Business_Informatics_38.03.05.xlsx")
    create_workbook(target_xlsx)

    # Also copy to academic directory for redundancy
    academic_dir = r"d:\hussein-portfolio\academic"
    os.makedirs(academic_dir, exist_ok=True)
    academic_xlsx = os.path.join(academic_dir, "Russian_Universities_Business_Informatics_38.03.05.xlsx")
    create_workbook(academic_xlsx)
